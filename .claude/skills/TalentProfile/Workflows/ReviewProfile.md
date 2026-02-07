# ReviewProfile Workflow

## Trigger
User asks to review their profile, check completeness, find gaps, or detect stale data.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at FULL effort. Do not skip phases.

## OBSERVE Phase — ISC Creation
⚠️ CREATE ISC TASKS NOW using TaskCreate. Do NOT use manual tables.

Create these ISC criteria (8 words, state-not-action, binary testable):

1. "All six profile files read and analyzed" — Source: EXPLICIT
2. "Staleness report identifies data older than threshold" — Source: EXPLICIT
3. "Gap analysis covers every required schema field" — Source: INFERRED
4. "Completeness percentage calculated for overall profile health" — Source: INFERRED
5. "Specific actionable suggestions provided for each gap" — Source: IMPLICIT

🎯 ISC Tasks:
[INVOKE TaskList — this is the source of truth, NO manual tables]

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: EXCLUDE — Single clear analysis approach, no alternatives to debate
- **FirstPrinciples**: EXCLUDE — Straightforward data analysis, no assumptions to challenge
- **RedTeam**: EXCLUDE — Not a proposal to stress-test
- **BeCreative**: EXCLUDE — Structured review, no divergence needed
- **Science**: EXCLUDE — Not experimental
- **Prompting**: EXCLUDE — Not a meta-prompting task

## EXECUTE Phase

### Step 1: Read All Profile Files
Read all 6 profile TELOS files + supporting files (MISSION.md, GOALS.md, PROJECTS.md).

### Step 2: Staleness Detection
Check `Last Used` dates in SKILLS.md and DOMAIN_EXPERTISE.md:
- **Fresh:** Updated within 30 days
- **Aging:** 30-90 days since last update
- **Stale:** >90 days since last update
- Flag AVAILABILITY.md `Last updated` date

### Step 3: Gap Analysis
Check for missing/empty sections against ProfileSchema.md:
- Empty skill categories (technical, domain, soft)
- No project history entries
- Missing learning goals
- Empty mentoring preferences
- No publications listed
- Missing domain intersections

### Step 4: Completeness Score
Calculate percentage of ProfileSchema.md fields that are populated:
- Total possible fields vs. populated fields
- Weight required fields higher than optional

### Step 5: Generate Suggestions
For each gap or stale entry, create a specific suggestion:
- "SKILLS.md: 'Flow Cytometry' last used 2025-12 — update or confirm still relevant"
- "CERTIFICATIONS.md: PMP expires 2025 — update status to Expired or Renewed"
- "AVAILABILITY.md: Last updated 60 days ago — refresh capacity and bandwidth"

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence]

## LEARN Phase
Write to `MEMORY/LEARNING/TALENT_PROFILE/`:
```
# Learning: Profile Review — [Date]
## Context — Which role's profile was reviewed
## Insight — Most common gap patterns
## Implication — What auto-sync should prioritize detecting
```

## Output
Structured review report:
- **Completeness:** X% (Y/Z fields populated)
- **Staleness:** Table of entries by freshness category
- **Gaps:** Specific missing data with suggestions
- **Recommendations:** Priority actions to improve profile quality
