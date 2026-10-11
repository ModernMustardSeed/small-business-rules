# Contributing

Corrections make this data better for everyone who relies on it. The bar for a change is one thing: a primary source.

## What counts as a primary source

- The official text of a statute, from the legislature's own code site or session law.
- The official text of a regulation, from the eCFR, the Federal Register, or a state's administrative code or register.
- An order, ruling or official notice from the agency that enforces the rule, such as the FCC, the FTC, the CRTC or a state utility commission.
- A court opinion, from the court or a reliable reporter, for case law.

Not enough on its own: law firm blogs, vendor compliance pages, news articles, AI answers and summaries on other compliance sites. They are useful for finding a rule; the change still needs the primary text.

If the official site cannot be read (some codes are hosted behind a paywall or block automated access), say so, name the copy you read, and include the operative text.

## How to propose a rule change

1. **Open an issue** with the [Rule change template](https://github.com/ModernMustardSeed/small-business-rules/issues/new?template=rule-change.md), or open a pull request. Either works.
2. **Include:**
   - The dataset and rule id (or the jurisdiction, for a new rule).
   - What is wrong or missing, in one or two sentences.
   - The citation, exactly as the source cites it.
   - The source URL.
   - A short verbatim quote of the operative language.
   - The effective date, if the change is new law, and any sunset date.
   - The date you read the source.
3. **A pull request may edit the JSON in `data/` directly** so the change is easy to review. The maintainers apply the accepted change to the rule source that also powers the Call Desk and Voice Agent Linter connectors, then re-export. The exported files replace hand edits, so your change lands through the export and the pull request is closed with a link to the commit that carried it, with credit to you.
4. **Run the check** before you submit: `node scripts/validate.mjs`.

## How a change is reviewed

- A maintainer reads the primary source you cite. Nothing is changed on a secondary source alone.
- If the source confirms the change, it is applied, the rule's `as_of` date is updated to the date it was re-read, and both this repository and the live connectors change together.
- If the source cannot be confirmed, the claim goes into the dataset's `unverified` list with the reason, so other readers can see it and help confirm it.
- Disagreements about how a statute applies to a set of facts are out of scope. This data states what the text says and links to it; applying it to a specific business is a question for that business's lawyer.

## Voice Agent Linter rules

A new linter rule needs a failure that happens on real calls, a bad and a good example, a fix, and, if the rule is about a vendor setting or a law, the vendor documentation or the legal source. Describe the failure in general terms; do not include real phone numbers, names or transcripts.

## Style

Plain words, short sentences, no em dashes. Dates as `YYYY-MM-DD`. Times as `HH:MM` in 24-hour time.

## Code of conduct

Be accurate and be kind. Assume good faith, argue from sources, and keep personal and client details out of issues and pull requests.

## Security

Do not open a public issue for a security problem. Use GitHub's private vulnerability reporting on this repository.
