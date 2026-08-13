# GOED Federal Funding Intelligence

Built for **GOED AI Builder Day 2026**. Helps a startup answer: *"What federal
government resources might be available to help my company grow, and why?"*
The differentiator over a search engine is understanding a founder's plain-
language description well enough to translate it into government-language
opportunities, filter by eligibility, rank by fit, and explain the reasoning
— including when the honest answer is "there probably isn't a strong federal
opportunity for this company right now."

Today's build is infrastructure: schemas, one live government data adapter,
an LLM provider abstraction, UI foundation, and deployment. Matching quality,
extraction, and polish are tomorrow's work — see [Hackathon TODO](#hackathon-todo).

## Architecture

```
Government Data Sources (Grants.gov, SBIR, SAM.gov, USAspending)
        │
        ▼
Source Adapters (lib/sources/*)       — the only code that knows vendor field names
        │
        ▼
Normalized Internal Data (types/*)    — GovernmentOpportunity, HistoricalAward
        │
        ▼
Intelligence / Matching Layer (types/matching.ts + tomorrow's implementation)
        │
        ▼
Founder Experience (components/*, app/page.tsx)
```

Government-specific fields (e.g. Grants.gov's `synopsis.awardCeiling`, SBIR's
`solicitation_topics`) never leak past their adapter's `normalize.ts`. The
matching engine and UI only ever see `GovernmentOpportunity`,
`HistoricalAward`, and `StartupProfile`.

## Technology stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Zod for runtime-validated schemas
- No database yet — add Supabase only where persistence actually earns its
  keep (e.g. caching Grants.gov results, saving a founder's session)
- Deployed on Vercel

## Government data sources

| Source | Status | Notes |
| --- | --- | --- |
| [Grants.gov Search2 API](https://api.grants.gov/v1/api/search2) | **Live** | `lib/sources/grants-gov`. No API key required. Search returns lightweight hits; `fetchOpportunity` gets full detail (description, eligibility, funding range). |
| SBIR (api.www.sbir.gov) | **Fixture** | `lib/sources/sbir`. Live endpoint returned `403 Forbidden` when tested (likely IP/rate gated) — using hand-shaped sample data matching the real API's schema so adapters and normalization are already correct. Swap `index.ts`'s data source when the live API is reachable. |
| SAM.gov | Not started | Env var placeholder (`SAM_GOV_API_KEY`) exists in `.env.example`. |
| USAspending.gov | Not started | Public API, no key needed. Planned for `HistoricalAward` enrichment. |

## Normalized data model (`src/types/`)

- **`startup-profile.ts`** — `StartupProfile`. Every field nullable/optional;
  `extractionConfidence` and `fieldsNeedingClarification` exist so the UI can
  ask a founder to fill gaps instead of guessing.
- **`government-opportunity.ts`** — `GovernmentOpportunity`. One shape for
  every source; `rawSourceData` retains the original payload for debugging.
- **`historical-award.ts`** — `HistoricalAward`. Answers "who else got this
  money?" — populated from SBIR awards today, USAspending later.
- **`matching.ts`** — interfaces only (no scoring logic yet): `ScoreComponent`,
  `MatchWeights`, `FitClassification` (`likely-fit` /
  `potential-fit-verify-eligibility` / `adjacent-opportunity` /
  `probably-not-a-fit`), `MatchingSummary` (carries `hasStrongMatch` so the
  product can honestly say no match exists).

## AI provider architecture (`src/lib/llm/`)

`LLMProvider` is a single interface (`complete()`); business logic imports
`getLLMProvider()` from `lib/llm` and never a vendor SDK directly. Selected at
runtime via `LLM_PROVIDER` env var:

- `mock` (default) — deterministic stand-in, no API key needed
- `anthropic` — minimal `fetch`-based implementation, no SDK dependency

Adding OpenAI/Gemini tomorrow means one new file under `lib/llm/providers/`
plus one `case` in `lib/llm/index.ts` — no changes to callers.

## Local development

```bash
npm install
cp .env.example .env.local   # defaults to mock LLM provider, no keys needed
npm run dev                  # http://localhost:3000
```

Try the live Grants.gov pipeline directly:

```bash
curl "http://localhost:3000/api/grants-gov/search?q=artificial+intelligence+health"
```

## Environment variables

See `.env.example` for the full list and comments. Nothing is required to run
locally — `LLM_PROVIDER=mock` and Grants.gov/USAspending need no keys. Set
`ANTHROPIC_API_KEY` (or future `OPENAI_API_KEY` / `GEMINI_API_KEY`) plus the
matching `LLM_PROVIDER` value to use a real model. `.env.local` is gitignored;
`.env.example` is the only env file committed.

## Testing

No formal test runner is wired up yet (kept out of scope for today per the
"don't overbuild" directive). What's been manually verified:

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — production build succeeds
- Grants.gov adapter hit the real API, normalized real results, and handled
  a bad-URL failure and a zero-result query gracefully
- SBIR adapter normalizes its fixtures without error
- All five GOED test `StartupProfile` fixtures parse against the Zod schema

## Deployment

Deployed on Vercel: **https://goed-hackathon-2026.vercel.app**

```bash
npx vercel --prod
```

GitHub auto-deploy-on-push isn't wired up yet (Vercel account needs a GitHub
login connection first — see Hackathon TODO); deploy manually with the
command above until that's connected.

## Planned matching architecture

Not implemented today — interfaces only, in `src/types/matching.ts`. Intended
shape for tomorrow:

- Hard eligibility rules (deterministic, not LLM-judged)
- Weighted score components: technology, industry, eligibility, funding,
  stage/R&D relevance, strategic relevance — weights live in one editable
  `MatchWeights` object, not scattered through logic
- LLM used only for explanation, terminology translation, and flagging
  concerns/next-steps — never as the eligibility authority
- Classification into `likely-fit` / `potential-fit-verify-eligibility` /
  `adjacent-opportunity` / `probably-not-a-fit`, with `probably-not-a-fit`
  as a legitimate, expected outcome (see GOED test case 5)

## Hackathon TODO

Tomorrow's work, roughly in priority order:

- [ ] Implement the actual matching engine (`MatchingEngine.match()`) against
      `DEFAULT_MATCH_WEIGHTS`
- [ ] LLM-based `StartupProfile` extraction from raw founder text
- [ ] Wire `CompanyDescriptionDemo` to real extraction instead of echoing input
- [ ] LLM-generated match explanations / concerns / next steps
- [ ] Try the live SBIR API again (auth headers? different host?) or find an
      alternate ingestion path; fall back to expanding the fixture set
- [ ] USAspending adapter for deeper `HistoricalAward` coverage
- [ ] SAM.gov adapter (entity/eligibility data)
- [ ] Run all five GOED test startups through the real pipeline and sanity-
      check results against the "expected areas" in the challenge brief —
      especially confirming test 5 doesn't get a forced match
- [ ] Connect GitHub → Vercel auto-deploy (add GitHub as a login connection
      in the Vercel account, then re-link the project)
- [ ] Real persistence (Supabase) if session/history turns out to matter for
      the demo — skip if it doesn't
- [ ] UI polish pass once the above are working

## Master Readiness Checklist

### Project Foundation
- [x] GitHub repository exists — https://github.com/rinoguajardo-png/goed-hackathon-2026
- [x] Git initialized
- [x] Clean initial commit exists
- [x] Next.js application runs locally
- [x] TypeScript enabled
- [x] Tailwind working
- [x] Basic home page loads without errors

### Environment
- [x] `.env.local` supported
- [x] `.env.example` exists
- [x] Secrets excluded from Git
- [x] Required environment variables documented

### LLM
- [x] Generic AI provider interface exists
- [x] Provider can be replaced without changing business logic
- [x] Mock provider works if no real API is configured

### Startup Data
- [x] StartupProfile schema exists
- [x] Missing/unknown values supported
- [x] Schema is strongly typed

### Government Opportunity Data
- [x] GovernmentOpportunity schema exists
- [x] Normalized representation supports multiple government sources
- [x] Raw source data can be retained for debugging

### Grants.gov
- [x] Grants.gov client exists
- [x] Successful real API request completed
- [x] Response parsed
- [x] At least one result normalized
- [x] Normalized result can be consumed/displayed
- [x] API errors handled gracefully

### SBIR
- [x] SBIR adapter/interface exists
- [x] Small fixture/sample data available
- [x] Sample can be normalized
- [x] Architecture does not require live SBIR availability

### GOED Test Cases
- [x] AI Healthcare fixture
- [x] Advanced Manufacturing fixture
- [x] Climate / Water fixture
- [x] Cybersecurity fixture
- [x] Consumer / Workforce fixture
- [x] Application/tests can load all five profiles

### Matching Preparation
- [x] Matching engine interface exists
- [x] Eligibility component supported
- [x] Technology relevance supported
- [x] Industry relevance supported
- [x] Funding compatibility supported
- [x] R&D/stage relevance supported
- [x] Strategic relevance supported
- [x] Explanation field supported
- [x] Scoring weights can be changed easily
- [x] System can represent "no strong match"

### Historical Awards
- [x] HistoricalAward model exists
- [x] Recipient supported
- [x] Agency/program supported
- [x] Amount/year/state supported
- [x] Technology/category supported
- [x] Architecture ready for USAspending/SBIR history

### UI Foundation
- [x] Company description input
- [x] Startup profile preview
- [x] Opportunity card
- [x] Match score/fit classification area
- [x] Explanation area
- [x] Concerns/verification area
- [x] Next-steps area

### Deployment
- [x] Production build succeeds
- [x] Basic deployment succeeds
- [x] Environment variables supported in deployment (`vercel env` verified empty/no secrets leaked)
- [x] No secrets exposed

### Documentation
- [x] README exists
- [x] Architecture documented
- [x] Setup instructions documented
- [x] Data sources documented
- [x] Hackathon TODO section exists
