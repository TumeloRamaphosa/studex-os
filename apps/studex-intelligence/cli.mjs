#!/usr/bin/env node
/**
 * Studex Intelligence CLI — Entry point
 * Usage: node cli.mjs [--brief]
 */
import { studexIntelligenceBrief } from './sources/studex-scanner.mjs';

const args = process.argv.slice(2);
const mode = args[0] || '--brief';

async function main() {
  if (mode === '--watch') {
    console.log('[Studex Scanner] Watch mode — scanning every 15 minutes...');
    setInterval(async () => {
      const brief = await studexIntelligenceBrief();
      console.log(`\n=== STUDENT INTELLIGENCE BRIEF ${new Date().toISOString()} ===`);
      console.log(`Sources: ${brief.meta.sourcesOk}/${brief.meta.sourcesRun} OK (${brief.meta.ms}ms)`);
      printBrief(brief);
    }, 15 * 60 * 1000);
  } else {
    const brief = await studexIntelligenceBrief();
    console.log(`=== STUDEX INTELLIGENCE BRIEF — ${new Date().toLocaleString('SAST', { timeZone: 'Africa/Johannesburg' })} ===`);
    console.log(`Sources: ${brief.meta.sourcesOk}/${brief.meta.sourcesRun} | ${brief.meta.ms}ms | Powered by Crucix OSINT Engine\n`);
    printBrief(brief);
  }
}

function printBrief(brief) {
  // Print priority opportunities first
  console.log('═══════════════════════════════════════════════════════');
  console.log('  TOP OPPORTUNITIES (Priority 1 — Act This Week)');
  console.log('═══════════════════════════════════════════════════════');
  brief.opportunities.filter(o => o.priority === 1).forEach(o => {
    console.log(`\n[${o.id}] ${o.category} — ${o.division}`);
    console.log(`  Thesis: ${o.thesis.slice(0, 120)}...`);
    console.log(`  Confidence: ${o.confidence} | Horizon: ${o.horizon}`);
    console.log(`  Action: ${o.action}`);
    console.log(`  Signals: ${o.signals.join(' | ')}`);
  });

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ALL OPPORTUNITIES BY DIVISION');
  console.log('═══════════════════════════════════════════════════════');
  const byDiv = brief.summary.byDivision;
  for (const [div, count] of Object.entries(byDiv)) {
    console.log(`  ${div}: ${count} opportunities`);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  MACRO CONTEXT');
  console.log('═══════════════════════════════════════════════════════');
  const macro = brief.results.find(r => r.name === 'MacroContext')?.data;
  if (macro) {
    console.log(`  Gold: ${macro.gold}`);
    console.log(`  Oil: ${macro.oil}`);
    console.log(`  Theme: ${macro.macroTheme}`);
    console.log(`  SA FDI: ${macro.saFDI}`);
    console.log(`  East Africa Trade: ${macro.eastAfricaTrade}`);
    console.log(`  Africa Food Market: ${macro.africaFoodMarket}`);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  MARITIME SIGNALS');
  console.log('═══════════════════════════════════════════════════════');
  const maritime = brief.results.find(r => r.name === 'Maritime')?.data;
  if (maritime) {
    console.log(`  Key Signal: ${maritime.signal}`);
    console.log(`  Chokepoints: Red Sea = ${maritime.chokepoints.redSea.status}, Cape = ${maritime.chokepoints.capeGoodHope.status}`);
    console.log(`  African Ports: Durban ${maritime.africanPorts.durban}, Walvis Bay ${maritime.africanPorts.walvisBay}, Mombasa ${maritime.africanPorts.mombasa}`);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  SOURCE STATUS');
  console.log('═══════════════════════════════════════════════════════');
  brief.results.forEach(r => {
    console.log(`  ${r.name}: ${r.status} (${r.ms}ms)${r.error ? ` ERROR: ${r.error}` : ''}`);
  });
}

main().catch(console.error);
