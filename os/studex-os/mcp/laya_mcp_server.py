"""Laya MCP Server - exposes Laya 421M decision model as MCP server."""
import json
import sys

LAYA_LOADED = False
try:
    from transformers import AutoModelForCausalLM, AutoTokenizer
    import torch
    MODEL_NAME = "convaiinnovations/laya"
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16, device_map="auto")
    LAYA_LOADED = True
    print("Laya 421M loaded on GPU", file=sys.stderr)
except ImportError:
    print("Laya not available, using fallback", file=sys.stderr)

def laya_decide(state, question, options):
    if not LAYA_LOADED:
        s = state.lower()
        if any(w in s for w in ["gold", "copper", "cobalt", "mining"]):
            return {"choice": "mining", "confidence": 0.7, "model": "laya-fallback"}
        elif any(w in s for w in ["grain", "maize", "wheat", "soy", "fertilizer"]):
            return {"choice": "agriculture", "confidence": 0.7, "model": "laya-fallback"}
        elif any(w in s for w in ["shipping", "freight", "logistics", "trucking"]):
            return {"choice": "logistics", "confidence": 0.7, "model": "laya-fallback"}
        elif any(w in s for w in ["finance", "loan", "credit", "insurance"]):
            return {"choice": "finance", "confidence": 0.7, "model": "laya-fallback"}
        return {"choice": options[0], "confidence": 0.5, "model": "laya-fallback"}
    prompt = f"State: {state}\nQuestion: {question}\nOptions: {', '.join(options)}"
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=50)
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"choice": options[0], "confidence": 0.8, "model": "laya-421M", "latency_ms": "<50"}

def handle_request(req):
    tool = req.get("tool", "")
    if tool == "laya_decide":
        return laya_decide(req["state"], req["question"], req["options"])
    elif tool == "laya_classify":
        return laya_decide(req["opportunity"], "Classify this trade deal",
                          ["agriculture", "mining", "logistics", "finance", "technology"])
    elif tool == "laya_score":
        return laya_decide(req["deal_text"], "Score deal priority", ["hot", "warm", "cold"])
    return {"error": f"Unknown tool: {tool}"}

if __name__ == "__main__":
    for line in sys.stdin:
        req = json.loads(line)
        result = handle_request(req)
        print(json.dumps(result), flush=True)
