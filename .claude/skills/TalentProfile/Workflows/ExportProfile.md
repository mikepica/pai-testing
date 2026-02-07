# ExportProfile Workflow

## Trigger
User asks to export profile, generate JSON, or export to JSON.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at FULL effort. Do not skip phases.

## OBSERVE Phase — ISC Creation
⚠️ CREATE ISC TASKS NOW using TaskCreate. Do NOT use manual tables.

Create these ISC criteria (8 words, state-not-action, binary testable):

1. "All six profile TELOS files successfully parsed" — Source: EXPLICIT
2. "JSON output matches ProfileSchema version one format" — Source: EXPLICIT
3. "No empty required fields in exported JSON" — Source: INFERRED
4. "JSON file written to shared profiles directory" — Source: EXPLICIT
5. "Schema version and export timestamp correctly set" — Source: IMPLICIT
6. "Existing TELOS context integrated into identity section" — Source: INFERRED

🎯 ISC Tasks:
[INVOKE TaskList — this is the source of truth, NO manual tables]

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: EXCLUDE — Single clear approach (parse markdown → write JSON), no alternatives to debate
- **FirstPrinciples**: EXCLUDE — Straightforward data transformation, no assumptions to challenge
- **RedTeam**: EXCLUDE — Not a proposal or claim to stress-test
- **BeCreative**: EXCLUDE — Structured format conversion, no divergence needed
- **Science**: EXCLUDE — Not iterative/experimental
- **Prompting**: EXCLUDE — Not a meta-prompting task

## EXECUTE Phase

### Step 1: Read Profile Files
Read all 6 profile TELOS files from `~/.claude/skills/PAI/USER/TELOS/`:
- `SKILLS.md` → parse skill tables (name, category, proficiency, years, last_used)
- `EXPERIENCE.md` → parse career history + project history tables
- `INTERESTS.md` → parse interests list, learning goals (checkbox status), mentoring preferences
- `AVAILABILITY.md` → parse capacity, constraints, bandwidth table
- `CERTIFICATIONS.md` → parse credentials table, education table, publications
- `DOMAIN_EXPERTISE.md` → parse primary/secondary domain tables, intersections

### Step 2: Read Supporting TELOS Files
Also read existing TELOS context:
- `MISSION.md` → identity.mission
- `GOALS.md` → goals array
- `CHALLENGES.md` → challenges array
- `BELIEFS.md` → beliefs array

### Step 3: Build JSON
Construct JSON following `ProfileSchema.md` structure. Use schema_version "1.0.0".

### Step 4: Determine Role ID
Detect which role is active by reading MISSION.md content or checking switch-role state:
- Innovation Lead → `innovation-lead`
- R&D Scientist → `rd-scientist`
- Data Scientist → `data-scientist`

### Step 5: Write JSON
Write to `$SHARED_DIR/profiles/{role-id}.json` (e.g., `shared/profiles/data-scientist.json`).

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence and status]:
- Validate JSON is well-formed (parse it back)
- Verify all required fields are present
- Confirm file was written to correct path

## LEARN Phase
Write to `MEMORY/LEARNING/TALENT_PROFILE/`:
```
# Learning: Profile Export — [Date]
## Context — Which role was exported
## Insight — What fields were missing or incomplete
## Implication — What profile updates would improve export quality
```

## Output
- Path to exported JSON file
- Summary of completeness (X/Y fields populated)
- Any gaps or stale data flagged for future UpdateProfile
