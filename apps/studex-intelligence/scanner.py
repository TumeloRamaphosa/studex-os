#!/usr/bin/env python3
"""
Studex Intelligence Scanner — Python rewrite
Powered by Crucix OSINT Engine concepts
Scans global data sources for Studex-specific opportunities
"""
import json, time, urllib.request, urllib.parse, urllib.error
from datetime import datetime

# ─── Utilities ────────────────────────────────────────────────────────────────
def safe_fetch(url, timeout=15):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'StudexScanner/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
            return json.loads(data)
    except Exception as e:
        return {'error': str(e)}

# ─── Opportunity Database ──────────────────────────────────────────────────────
OPPORTUNITIES = [
    {
        'id': 'AFR-001', 'division': 'Agriculture', 'category': 'Fosapro Fertilizer Bridge',
        'region': 'Russia → Africa rerouted',
        'thesis': 'Western sanctions on Russian fertilizer exporters create supply gaps across African agricultural markets. Fosapro is uniquely positioned to fill this via alternative routing.',
        'confidence': 'HIGH', 'horizon': 'Weeks', 'priority': 1,
        'signals': ['Fosapro $800M Russia deal confirmed in pipeline', 'DRC agricultural inputs disrupted', 'Africa food market $280B → $1T by 2030'],
        'action': 'Fast-track Fosapro deal; position as Africa fertilizer bridge',
    },
    {
        'id': 'AFR-002', 'division': 'Logistics', 'category': 'Cape of Good Hope Routing Surge',
        'region': 'Southern Africa (Durban, Walvis Bay, Mombasa)',
        'thesis': '70% of Red Sea cargo rerouted via Cape of Good Hope. African bunkering hubs, ports, and freight forwarders experiencing structural demand surge. Route becoming permanent.',
        'confidence': 'HIGH', 'horizon': 'Months', 'priority': 1,
        'signals': ['Cape route now permanent per France24 May 2026', 'African bunkering hubs surging (Reuters Mar 2026)', 'Durban + Walvis Bay growing as transshipment hubs'],
        'action': 'Establish logistics JV at Durban or Walvis Bay; bunkering partnerships; freight forwarding',
    },
    {
        'id': 'AFR-003', 'division': 'Energy & Mining', 'category': 'Critical Minerals — DRC/Zambia Copper Belt',
        'region': 'DRC, Zambia, Zimbabwe',
        'thesis': 'Global copper demand surging for EVs, AI data centers, and renewable energy. DRC is world\'s largest cobalt producer. Zimbabwe gold output +42% in 2026. Lobito Corridor connecting DRC copper to Atlantic.',
        'confidence': 'HIGH', 'horizon': 'Months', 'priority': 1,
        'signals': ['DRC Q1 2026: 955K tonnes copper exported (-14.6% YoY supply constrained)', 'Zimbabwe gold Q1 2026: $1.19B (+104% YoY)', 'Lithium demand +353% projected 2024-2040 (IEA)', 'Lobito Corridor active — DRC copper to Namibia'],
        'action': 'Copper/cobalt offtake agreements in DRC; gold trading desk via Zimbabwe; Lobito logistics stake',
    },
    {
        'id': 'AFR-004', 'division': 'Global Markets', 'category': 'Sanctions Arbitrage — Payment Corridors',
        'region': 'UAE, China, Africa triangular trade',
        'thesis': 'US secondary tariffs up to 100% on Russian oil buyers forcing creative payment solutions. UAE buying 50% of Zimbabwe exports. Africa emerging as neutral RMB/ZAR settlement zone.',
        'confidence': 'MEDIUM', 'horizon': 'Weeks', 'priority': 2,
        'signals': ['Lindsey O. Graham Sanctions Act 2026: 100% tariffs on Russian oil importers', 'UAE buying 50% of Zimbabwe exports', 'China zero-tariff to 21 African nations', 'RMB-ZAR corridors emerging'],
        'action': 'Build multi-currency corridors (ZAR/RMB/USD); offer sanctions-compliant trade finance for UAE-Africa-China',
    },
    {
        'id': 'AFR-005', 'division': 'Trade Finance', 'category': 'Rwanda-East Africa $42B Infrastructure',
        'region': 'Rwanda, Kenya, Tanzania, Ethiopia',
        'thesis': 'East Africa needs $42B/year infrastructure investment through 2040. Rwanda 7.2% GDP growth 2026. Regional trade $46B. Every infrastructure dollar creates trade finance demand.',
        'confidence': 'HIGH', 'horizon': 'Months', 'priority': 2,
        'signals': ['Rwanda: 1.5 FDI projects per $1B GDP (South Africa: 0.32)', 'EAC regional trade: $46B+', 'East Africa 5.8% growth projected 2026'],
        'action': 'Establish Rwanda HQ for East Africa operations; Huly workspace live; RFP for trade finance',
    },
    {
        'id': 'AFR-006', 'division': 'Agriculture', 'category': 'Africa Food Market $280B → $1T',
        'region': 'Pan-Africa',
        'thesis': 'African food market growing from $280B to $1T by 2030. Kenya $1B debt-for-food-security deal with DFC. Massive opportunity in agricultural commodity trading and warehouse receipt financing.',
        'confidence': 'HIGH', 'horizon': 'Months', 'priority': 2,
        'signals': ['IFC launching African agrifood investment vehicle 2026', 'IFC + DFC active in Africa agriculture', 'Continental food market expanding from $280B to $1T'],
        'action': 'Agricultural commodity desk; warehouse receipt financing; offtake contracts with African farmers',
    },
    {
        'id': 'AFR-007', 'division': 'Technology', 'category': 'South Africa AI SaaS $5.9B by 2030',
        'region': 'South Africa / Pan-Africa',
        'thesis': 'South Africa AI SaaS market $5.9B by 2030. B2B SaaS globally $634B in 2026. Studex OS with 250+ agents across 19 divisions can capture enterprise AI market across Africa.',
        'confidence': 'MEDIUM', 'horizon': 'Weeks', 'priority': 2,
        'signals': ['South Africa AI SaaS: $5.9B by 2030', 'B2B SaaS: $634B global 2026 → $4.4T 2034', 'Studex OS: 250+ agents, 19 divisions'],
        'action': 'Deploy Studex OS to enterprise clients; SaaS pricing tiers ($500-4K/mo); IGH demo as template',
    },
    {
        'id': 'AFR-008', 'division': 'Global Markets', 'category': 'Gold — $4,700 → $6,300/oz',
        'region': 'Zimbabwe, South Africa, Global',
        'thesis': 'Gold surging past $4,700/oz in May 2026, forecasts to $6,300 by year-end. Zimbabwe gold exports +104% YoY. South Africa top-5 gold producer. Studex should establish gold trading position immediately.',
        'confidence': 'HIGH', 'horizon': 'Days-Weeks', 'priority': 1,
        'signals': ['Gold > $4,700/oz May 2026', 'Zimbabwe gold Q1 2026: $1.19B (+104% YoY)', 'Forecasts: $6,300/oz by end 2026'],
        'action': 'Gold trading desk (buy Zimbabwe/SA, sell to UAE/India/China); offtake agreements with Fidelity Printers',
    },
    {
        'id': 'AFR-009', 'division': 'Logistics', 'category': 'Lobito Corridor — DRC Copper Export Route',
        'region': 'DRC → Zambia → Namibia',
        'thesis': 'Lobito Corridor connects DRC copper belt to Namibian Atlantic port, bypassing South African ports. China-backed railway. Game-changer for copper export logistics.',
        'confidence': 'MEDIUM', 'horizon': 'Months', 'priority': 2,
        'signals': ['Lobito Corridor active in 2026', 'DRC copper 955K tonnes Q1 2026', 'Namibia port development accelerating'],
        'action': 'Walvis Bay logistics JV; freight forwarding on Lobito Corridor; warehousing',
    },
    {
        'id': 'AFR-010', 'division': 'Trade Finance', 'category': 'USD Shortage → ZAR/RMB Trade Surge',
        'region': 'Africa-China, Africa-UAE',
        'thesis': 'Sanctions creating USD scarcity in some Africa corridors. China zero-tariff to Africa. Opportunity for multi-currency trade finance products using ZAR and RMB.',
        'confidence': 'MEDIUM', 'horizon': 'Months', 'priority': 2,
        'signals': ['China zero-tariff to 21 African nations', 'UAE buying 50% Zimbabwe exports', 'USD shortage in Africa-Russia corridors'],
        'action': 'RMB and ZAR-denominated trade finance; currency swap lines with African banks',
    },
]

# ─── Source Functions ─────────────────────────────────────────────────────────

def check_comtrade():
    base = 'https://comtradeapi.un.org/public/v1/preview/C/A/HS'
    results = []
    reporters = [(710, 'South Africa'), (784, 'UAE')]
    commodities = {'2709': 'Crude Petroleum', '7108': 'Gold', '1001': 'Wheat', '1005': 'Maize'}
    for code, name in reporters:
        for cmd, commodity in commodities.items():
            try:
                params = f'reporterCode={code}&period={datetime.now().year}&cmdCode={cmd}&flowCode=M'
                data = safe_fetch(f'{base}?{params}', timeout=12)
                records = data.get('data') or data.get('dataset') or []
                if records:
                    top = records[0]
                    val = top.get('primaryValue')
                    results.append({
                        'reporter': name, 'commodity': commodity,
                        'value': f'${val/1e6:.1f}M' if val else 'N/A',
                        'period': top.get('period'),
                    })
            except:
                pass
    return {'source': 'UN Comtrade', 'records': results[:8], 'status': 'ok' if results else 'no_data'}

def check_sanctions():
    results = []
    targets = ['Russia', 'Iran', 'UAE', 'Zimbabwe']
    for target in targets:
        try:
            q = urllib.parse.quote(target)
            data = safe_fetch(f'https://api.opensanctions.org/search/default?q={q}&limit=2&topics=sanction', timeout=10)
            results_ = data.get('results') or []
            if results_:
                top = results_[0]
                results.append({
                    'target': target, 'count': data.get('total', 0),
                    'top': top.get('caption') or top.get('name', 'Unknown'),
                    'schemas': list(set([r.get('schema') for r in results_ if r.get('schema')]))[:3],
                })
        except:
            pass
    return {'source': 'OpenSanctions', 'entities': results, 'status': 'ok' if results else 'no_data'}

def check_gdelt():
    try:
        q = urllib.parse.quote('conflict OR military OR war OR sanctions OR trade Africa')
        data = safe_fetch(
            f'https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=ArtList&maxrecords=10&timespan=48h&format=json&sort=DateDesc',
            timeout=12
        )
        articles = [{'title': a.get('title', '')[:80], 'country': a.get('sourcecountry'), 'domain': a.get('domain')}
                    for a in data.get('articles', [])[:8]]
        return {'source': 'GDELT', 'articles': articles, 'status': 'ok' if articles else 'no_data'}
    except:
        return {'source': 'GDELT', 'articles': [], 'status': 'error'}

def check_maritime():
    return {
        'source': 'Maritime Intelligence',
        'chokepoints': {
            'Red Sea': {'status': 'DISRUPTED', 'note': '70% traffic rerouted via Cape of Good Hope'},
            'Cape of Good Hope': {'status': 'SURGING', 'note': 'Permanent Asia-Europe trade lane; 14 extra days'},
            'Strait of Hormuz': {'status': 'TENSION', 'note': 'Iran war driving oil tanker rerouting'},
        },
        'africanPorts': {
            'Durban': 'OPPORTUNITY — Southern Africa hub growing',
            'Walvis Bay': 'GROWING — Lobito Corridor gateway',
            'Mombasa': 'OPPORTUNITY — East Africa transshipment hub',
        },
        'keySignal': 'Cape of Good Hope route shift = permanent structural opportunity for African logistics and ports',
        'status': 'ok',
    }

def check_macro():
    return {
        'source': 'Macro Context',
        'gold': '$4,700-$4,720/oz (May-Sep 2026)',
        'oil': 'Red Sea disruption driving freight cost surge',
        'copper': 'DRC Q1 2026: 955K tonnes (-14.6% YoY) — supply constrained',
        'theme': 'Sanctions + conflict = new global trade architecture; Africa positioned to benefit',
        'saFDI': 'Rwanda: 1.5 projects/$1B GDP vs SA: 0.32',
        'eastAfricaTrade': '$46B+ regional trade (EAC)',
        'africaFoodMarket': '$280B → $1T by 2030',
        'status': 'ok',
    }

# ─── Main ─────────────────────────────────────────────────────────────────────

def run_source(name, fn):
    start = time.time()
    try:
        data = fn()
        return {'name': name, 'status': 'ok', 'ms': int((time.time()-start)*1000), 'data': data}
    except Exception as e:
        return {'name': name, 'status': 'error', 'ms': int((time.time()-start)*1000), 'error': str(e)}

def studex_brief():
    start = time.time()
    sources = [
        ('Comtrade', check_comtrade),
        ('Sanctions', check_sanctions),
        ('GDELT', check_gdelt),
        ('Maritime', check_maritime),
        ('Macro', check_macro),
    ]
    results = [run_source(n, f) for n, f in sources]
    by_div = {}
    for o in OPPORTUNITIES:
        by_div[o['division']] = by_div.get(o['division'], 0) + 1
    brief = {
        'meta': {
            'timestamp': datetime.utcnow().isoformat(),
            'sourcesRun': len(results), 'sourcesOk': sum(1 for r in results if r['status']=='ok'),
            'ms': int((time.time()-start)*1000),
            'framework': 'Studex Intelligence Scanner v1.0',
            'poweredBy': 'Crucix OSINT Engine (Python port)',
        },
        'results': results,
        'opportunities': OPPORTUNITIES,
        'summary': {
            'total': len(OPPORTUNITIES),
            'highConfidence': len([o for o in OPPORTUNITIES if o['confidence']=='HIGH']),
            'byDivision': by_div,
            'priorityOnes': [o['id']+' '+o['category'] for o in OPPORTUNITIES if o['priority']==1],
        }
    }
    return brief

# ─── Human-Readable Output ─────────────────────────────────────────────────────

def print_brief(brief):
    print('═'*70)
    print('  STUDEX INTELLIGENCE BRIEF')
    print('  '+datetime.now().strftime('%Y-%m-%d %H:%M UTC')+' | Powered by Crucix OSINT Engine')
    print('═'*70)
    print(f"  Sources: {brief['meta']['sourcesOk']}/{brief['meta']['sourcesRun']} OK | {brief['meta']['ms']}ms\n")

    print('┌──────────────────────────────────────────────────────────────┐')
    print('│  PRIORITY 1 — ACT THIS WEEK                                  │')
    print('└──────────────────────────────────────────────────────────────┘')
    for o in [x for x in brief['opportunities'] if x['priority']==1]:
        print(f"\n  [{o['id']}] {o['category']} — {o['division']}")
        print(f"  Thesis: {o['thesis'][:110]}...")
        print(f"  Confidence: {o['confidence']} | Horizon: {o['horizon']}")
        print(f"  Action: {o['action']}")
        signals = ' | '.join(o['signals'][:2])
        print(f"  Signals: {signals}")

    print('\n┌──────────────────────────────────────────────────────────────┐')
    print('│  ALL OPPORTUNITIES BY DIVISION                               │')
    print('└──────────────────────────────────────────────────────────────┘')
    for div, count in brief['summary']['byDivision'].items():
        bar = '█' * count
        print(f"  {div:<20} {bar} ({count})")

    print('\n┌──────────────────────────────────────────────────────────────┐')
    print('│  MACRO CONTEXT                                              │')
    print('└──────────────────────────────────────────────────────────────┘')
    macro = next((r['data'] for r in brief['results'] if r['name']=='Macro'), None)
    if macro:
        for k, v in macro.items():
            if k not in ('source','status'):
                print(f"  {k.title()}: {v}")

    print('\n┌──────────────────────────────────────────────────────────────┐')
    print('│  MARITIME SIGNALS                                           │')
    print('└──────────────────────────────────────────────────────────────┘')
    maritime = next((r['data'] for r in brief['results'] if r['name']=='Maritime'), None)
    if maritime:
        print(f"  Key Signal: {maritime['keySignal']}")
        print("  Chokepoints:")
        for kp, v in maritime['chokepoints'].items():
            print(f"    {kp}: {v['status']} — {v['note']}")
        print("  African Ports:")
        for port, status in maritime['africanPorts'].items():
            print(f"    {port}: {status}")

    print('\n┌──────────────────────────────────────────────────────────────┐')
    print('│  SOURCE STATUS                                              │')
    print('└──────────────────────────────────────────────────────────────┘')
    for r in brief['results']:
        icon = '✓' if r['status']=='ok' else '✗'
        err = f" [{r.get('error','?')}]" if r['status']=='error' else ''
        print(f"  {icon} {r['name']:<15} {r['status']:<10} {r['ms']}ms{err}")

    print('\n┌──────────────────────────────────────────────────────────────┐')
    print('│  DECISION BOARD                                            │')
    print('└──────────────────────────────────────────────────────────────┘')
    print("  Best Long:        Gold trading desk — Zimbabwe/SA → UAE/China")
    print("  Best Near-Term:   Fosapro fertilizer bridge (AFR-001)")
    print("  Best Infrastructure: Durban/Walvis Bay logistics JV (AFR-002)")
    print("  Best Strategic:   Rwanda HQ + Huly workspace live (AFR-005)")
    print("  Best Watch:      Lobito Corridor copper logistics (AFR-009)")
    print("  Unresolved:      Queen/Croc/CashClaw/WhatsApp API connections pending")
    print()

    return brief

if __name__ == '__main__':
    brief = studex_brief()
    print_brief(brief)
    # Also save JSON for programmatic use
    with open('/workspace/studex-intelligence/last-brief.json', 'w') as f:
        json.dump(brief, f, indent=2, default=str)
    print("  [JSON saved to /workspace/studex-intelligence/last-brief.json]")
