// Checks that every rule in data/ carries what this repository promises:
// a citation, a primary source URL, an as-of date, and (where rules have ids) a unique id.
// No dependencies. Run: node scripts/validate.mjs
import { readFileSync } from 'node:fs';

const errors = [];
const load = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function sourced(rule, where) {
  if (!rule.citation || typeof rule.citation !== 'string') errors.push(`${where}: missing citation`);
  if (!/^https?:\/\/\S+$/.test(rule.source_url ?? '')) errors.push(`${where}: source_url must be an http or https URL`);
  if (!ISO.test(rule.as_of ?? '')) errors.push(`${where}: as_of must be YYYY-MM-DD`);
}

function envelope(d, file) {
  for (const k of ['dataset', 'as_of', 'disclaimer', 'license']) if (!d[k]) errors.push(`${file}: missing ${k}`);
  if (d.license !== 'CC-BY-4.0') errors.push(`${file}: license must be CC-BY-4.0`);
}

function uniqueIds(rules, file) {
  const seen = new Set();
  for (const r of rules) {
    if (!r.id) errors.push(`${file}: a rule has no id`);
    else if (seen.has(r.id)) errors.push(`${file}: duplicate id ${r.id}`);
    seen.add(r.id);
  }
}

const TIME = /^([01]\d|2[0-4]):[0-5]\d$/;

// Calling hours
{
  const f = 'data/call-desk/calling-hours.json';
  const d = load(f);
  envelope(d, f);
  uniqueIds(d.rules, f);
  for (const r of d.rules) {
    sourced(r, `${f} ${r.id}`);
    for (const t of r.call_types) if (!d.call_types.values.includes(t)) errors.push(`${f} ${r.id}: unknown call type ${t}`);
    for (const w of r.windows) {
      if (!TIME.test(w.start) || !TIME.test(w.end) || w.start >= w.end) errors.push(`${f} ${r.id}: bad window ${w.start} to ${w.end}`);
      if (!w.days.every((x) => Number.isInteger(x) && x >= 0 && x <= 6)) errors.push(`${f} ${r.id}: days must be 0 to 6`);
    }
  }
}

// Recording consent
{
  const f = 'data/call-desk/recording-consent.json';
  const d = load(f);
  envelope(d, f);
  sourced(d.federal, `${f} federal`);
  const regions = new Set();
  for (const r of d.rules) {
    sourced(r, `${f} ${r.region}`);
    if (!['one_party', 'all_party', 'mixed'].includes(r.consent)) errors.push(`${f} ${r.region}: consent must be one_party, all_party or mixed`);
    if (regions.has(r.region)) errors.push(`${f}: duplicate region ${r.region}`);
    regions.add(r.region);
  }
}

// AI disclosure
{
  const f = 'data/call-desk/ai-disclosure.json';
  const d = load(f);
  envelope(d, f);
  const all = [...d.federal, ...d.ai_disclosure, ...d.automated_call_identification];
  uniqueIds(all, f);
  for (const r of all) sourced(r, `${f} ${r.id}`);
}

// Voice Agent Linter
{
  const f = 'data/voice-linter/rules.json';
  const d = load(f);
  envelope(d, f);
  uniqueIds(d.rules, f);
  for (const r of d.rules) {
    if (!d.severities.includes(r.severity)) errors.push(`${f} ${r.id}: unknown severity ${r.severity}`);
    if (!d.categories.includes(r.category)) errors.push(`${f} ${r.id}: unknown category ${r.category}`);
    for (const k of ['title', 'rationale', 'fix']) if (!r[k]) errors.push(`${f} ${r.id}: missing ${k}`);
    if (!r.example?.bad || !r.example?.good) errors.push(`${f} ${r.id}: needs a bad and a good example`);
    r.sources.forEach((s, i) => sourced(s, `${f} ${r.id} source ${i + 1}`));
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log('All rules carry a citation, a source URL and an as-of date. No duplicate ids.');
