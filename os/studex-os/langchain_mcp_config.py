"""
studex_langchain_mcp.py
LangChain MCP hub — connects all AI models and agents into one orchestration layer.
"""
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import os

# ─── MODEL CONNECTIONS ───────────────────────────────────

# Qwen API (Alibaba Cloud)
qwen = ChatOpenAI(
    model="qwen-plus",
    api_key=os.getenv("QWEN_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    temperature=0.7
)

# Grok API (xAI)
grok = ChatOpenAI(
    model="grok-2",
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.x.ai/v1",
    temperature=0.7
)

# Gemini API (Google Cloud)
gemini = ChatOpenAI(
    model="gemini-2.0-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    temperature=0.7
)

# Local Ollama (on Razer Blade / Desktop)
ollama_local = ChatOllama(
    base_url="http://localhost:11434",
    model="qwen2.5:14b",
    temperature=0.5
)

# ─── DECISION MODEL CONNECTIONS ──────────────────────────

# Laya API (local server on Razer Blade GTX 1080)
class LayaClient:
    """Laya 421M decision model — runs locally on GPU machine."""
    def __init__(self, base_url="http://10.0.0.5:8080"):
        self.base_url = base_url
    
    def decide(self, state: str, questions: list) -> dict:
        """Send state + questions to Laya. Returns typed decisions."""
        import requests
        resp = requests.post(f"{self.base_url}/decide", json={
            "state": state,
            "questions": questions
        }, timeout=30)
        return resp.json()

# Kev via Ollama (local)
kev = ChatOllama(
    base_url="http://localhost:11434",
    model="kev:latest",  # Kev LoRA on Ollama
    temperature=0.3
)

# ─── STUDENT ROUTING GRAPH ──────────────────────────────

class DealState(TypedDict):
    opportunity: str
    division: str
    priority: str
    deal_size: str
    analysis: str
    documents: list
    score: int
    status: str

def classify_node(state: DealState) -> DealState:
    """Station 1: Classify incoming opportunity."""
    prompt = f"""Classify this trade opportunity:
    
{state['opportunity']}

Return JSON with: division, priority, deal_size, confidence."""
    
    result = qwen.invoke([
        SystemMessage(content="You are a trade opportunity classifier. Return ONLY valid JSON."),
        HumanMessage(content=prompt)
    ])
    
    import json
    data = json.loads(result.content)
    return {**state, **data, "status": "classified"}

def analyze_node(state: DealState) -> DealState:
    """Station 2: Research and validate opportunity."""
    # Run Crucix scanner
    prompt = f"""Analyze this deal opportunity:

Division: {state['division']}
Priority: {state['priority']}
Description: {state['opportunity']}

Research: partner verification, sanctions check, market conditions.
Return: analysis summary + risk flags + recommendation."""
    
    result = grok.invoke([
        SystemMessage(content="You are a senior trade analyst. Be thorough and conservative."),
        HumanMessage(content=prompt)
    ])
    
    return {**state, "analysis": result.content, "status": "analyzed"}

def implement_node(state: DealState) -> DealState:
    """Station 3: Generate documents and proposals."""
    prompt = f"""Generate deal documents for:

Division: {state['division']}
Opportunity: {state['opportunity']}
Analysis: {state['analysis']}

Generate: LOI draft, compliance checklist, client proposal outline."""
    
    result = gemini.invoke([
        SystemMessage(content="You are a deal document generator for African trade."),
        HumanMessage(content=prompt)
    ])
    
    return {**state, "documents": [result.content], "status": "implemented"}

def review_node(state: DealState) -> DealState:
    """Station 4: Score and deliver to CEO."""
    prompt = f"""Score this deal package:

Division: {state['division']}
Opportunity: {state['opportunity']}
Analysis: {state['analysis']}
Documents: {state['documents']}

Score 1-10 and give final recommendation."""
    
    result = qwen.invoke([
        SystemMessage(content="You are the final deal reviewer. Be strict and fair."),
        HumanMessage(content=prompt)
    ])
    
    return {**state, "status": "reviewed"}

# Build graph
graph = StateGraph(DealState)
graph.add_node("classify", classify_node)
graph.add_node("analyze", analyze_node)
graph.add_node("implement", implement_node)
graph.add_node("review", review_node)

graph.set_entry_point("classify")
graph.add_edge("classify", "analyze")
graph.add_edge("analyze", "implement")
graph.add_edge("implement", "review")
graph.add_edge("review", END)

studex_graph = graph.compile()

# ─── FAST PATH: Laya filter ─────────────────────────────

def laya_filter(opportunity_text: str) -> dict:
    """Fast Laya decision: classify + route instantly."""
    laya = LayaClient("http://10.0.0.5:8080")  # Razer Blade
    
    questions = [
        {"type": "choice", "question": "Which division?", "options": ["agriculture", "mining", "logistics", "finance", "technology"]},
        {"type": "choice", "question": "Priority?", "options": ["hot", "warm", "cold"]},
        {"type": "score", "question": "Deal size estimate (0-4 = R50K, 5-7 = R200K, 8-9 = R1M, 10 = R5M+)", "min": 0, "max": 10},
        {"type": "noul", "question": "Is this sanctioned or high-risk country?", "options": ["yes", "no"]},
    ]
    
    return laya.decide(opportunity_text, questions)

# ─── USAGE EXAMPLE ─────────────────────────────────────

if __name__ == "__main__":
    # Fast Laya filter
    opp = "Gold shipment from DRC, 500kg, $2.5M, buyer in Dubai"
    laya_result = laya_filter(opp)
    print("LAYA FAST DECISION:", laya_result)
    
    # Full pipeline
    initial_state = {
        "opportunity": opp,
        "division": "",
        "priority": "",
        "deal_size": "",
        "analysis": "",
        "documents": [],
        "score": 0,
        "status": "pending"
    }
    
    final_state = studex_graph.invoke(initial_state)
    print("FINAL DEAL SCORE:", final_state["score"])
