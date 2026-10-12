# small-business-rules

Open, sourced rule data for businesses that make calls and run AI voice agents in the United States and Canada. Every rule carries the statute or regulation it comes from, a link to the primary source, a short quote of the operative text, and the date the source was read.

> **Informational, not legal advice.** Laws change and courts interpret them. This data is a starting point for your own review, not a substitute for a lawyer licensed in the jurisdiction. See [Disclaimer](#disclaimer).

## What is here

| Dataset | File | What it answers |
|---|---|---|
| Calling hours | [`data/call-desk/calling-hours.json`](data/call-desk/calling-hours.json) | When may a business place a sales or automated call, by federal rule, state, territory and province? |
| Recording consent | [`data/call-desk/recording-consent.json`](data/call-desk/recording-consent.json) | Does one party or every party have to consent before a call is recorded? |
| AI disclosure | [`data/call-desk/ai-disclosure.json`](data/call-desk/ai-disclosure.json) | When must a caller say it is an AI or an automated voice, and when must an automated call identify the business? |
| Region codes | [`data/call-desk/regions.json`](data/call-desk/regions.json) | The state, territory and province codes the datasets use. |
| Voice Agent Linter rules | [`data/voice-linter/rules.json`](data/voice-linter/rules.json) | What goes wrong in AI voice agent prompts and configs (Vapi, Retell, ElevenLabs Agents, OpenAI Realtime), why, and how to fix it. |

Readable tables of the same data are in [`docs/`](docs):

- [Calling hours](docs/calling-hours.md)
- [Call recording consent](docs/recording-consent.md)
- [AI voice disclosure and automated call identification](docs/ai-disclosure.md)
- [Voice Agent Linter rules](docs/voice-linter-rules.md)

[`data/index.json`](data/index.json) lists each dataset with its as-of date and current rule count.

## How the data is made

Each rule was read on a primary source: the state's official code or register, the eCFR, the FCC, or the court's opinion. Where an official site refused automated reads, the rule says so (`verified_via: "secondary"` in the consent data) and names the copy that was read. Rules that could not be confirmed on a primary source are not applied; they are listed under `unverified` with the reason, so the gap is visible instead of guessed.

The same data powers two free MCP connectors for Claude and other AI assistants, built by Modern Mustard Seed:

- **Call Desk** answers "can I call this number now, and what must I say" from the calling hours, consent and disclosure rules. Docs: [mcp.modernmustardseed.com/docs/call-desk](https://mcp.modernmustardseed.com/docs/call-desk)
- **Voice Agent Linter** checks a voice agent's prompt and config against the linter rules. Docs: [mcp.modernmustardseed.com/docs/voice-linter](https://mcp.modernmustardseed.com/docs/voice-linter)

The files in `data/` and `docs/` are generated from the connectors' rule source by an export script, so this repository and the live connectors always state the same rules. Corrections land in the source first and are then re-exported here.

## Using the data

The JSON has no dependencies and no build step. Read it directly:

```js
const hours = await fetch('https://raw.githubusercontent.com/ModernMustardSeed/small-business-rules/main/data/call-desk/calling-hours.json').then((r) => r.json());
const florida = hours.rules.filter((r) => r.jurisdiction === 'FL');
```

Field notes:

- **Calling hours:** each window is `[start, end)` in the called party's local time, so a `21:00` end means the last allowed minute is 20:59. Days run `0` Sunday to `6` Saturday. A rule with `fixed_zone` is evaluated in that zone instead. `in_force_from` and `in_force_until` bound when a rule applies.
- **Call types:** `sales_live`, `sales_automated` (autodialer, prerecorded or AI voice), `automated_non_sales` and `live_non_sales`. The FCC treats AI-generated voices as artificial voices under the TCPA (FCC 24-17), so an AI voice agent making a sales call is `sales_automated`.
- **Every rule:** `citation`, `source_url`, `as_of` (the date the source was read), `effective` or `effective_date` where known, and `quote`, a short verbatim excerpt.

Check the data yourself with `node scripts/validate.mjs`. It confirms every rule has a citation, a source URL and an as-of date, and that no id repeats. The same check runs on every pull request.

## Contributing

Found a rule that is wrong, out of date or missing? Open an issue or a pull request with a primary source. [CONTRIBUTING.md](CONTRIBUTING.md) explains what counts as a primary source and how a change is reviewed.

## Licenses

- **Data** (`data/` and `docs/`): [Creative Commons Attribution 4.0 International](LICENSE-DATA) (CC BY 4.0). Attribute as: *Modern Mustard Seed, small-business-rules, https://github.com/ModernMustardSeed/small-business-rules*.
- **Code** (`scripts/` and `.github/`): [MIT](LICENSE).

The quoted statutory and regulatory text is public law and is quoted for reference.

## Disclaimer

This repository is informational and is not legal advice. It does not create an attorney-client relationship. Laws, regulations and their interpretation change, local rules and contracts can add requirements, and some rules turn on facts this data cannot know, such as prior consent or an established business relationship. The data is provided as is, without warranty of any kind, as the licenses state. Before you rely on any rule, confirm it with a lawyer licensed in the jurisdiction.

## Built by Modern Mustard Seed

Maintained by [Modern Mustard Seed](https://modernmustardseed.com), an AI studio in Kalispell, Montana that builds websites, AI voice agents and custom software for small businesses, managed for you, end to end.

- [Call Desk docs](https://mcp.modernmustardseed.com/docs/call-desk): the connector that answers from the calling hours, consent and disclosure rules here.
- [Voice Agent Linter docs](https://mcp.modernmustardseed.com/docs/voice-linter): the connector that checks a voice agent against the linter rules here.
- [AI voice agents we build and run](https://modernmustardseed.com/voice-agents)
- [Every connector we have built for Claude](https://modernmustardseed.com/built-for-claude)
