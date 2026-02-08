# ExportProfile Workflow

## Trigger
User asks to export profile, generate JSON, or export to JSON.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at FULL effort. Do not skip phases.

## OBSERVE Phase — ISC Creation
Create these ISC criteria (8 words, state-not-action, binary testable):

1. "Export leads with narrative identity and mission" — Source: EXPLICIT
2. "Downstream system can evaluate person from export" — Source: INFERRED
3. "Schema captures motivation behind skills and goals" — Source: EXPLICIT
4. "New ProfileSchema replaces version one format cleanly" — Source: EXPLICIT
5. "Export works end to end with new format" — Source: IMPLICIT

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: EXCLUDE — Single clear approach (read TELOS → synthesize narrative → build JSON), no alternatives to debate
- **FirstPrinciples**: EXCLUDE — Schema design already completed. Execution is straightforward data transformation + synthesis.
- **RedTeam**: EXCLUDE — Not a proposal or claim to stress-test
- **BeCreative**: EXCLUDE — Structured format with defined schema. No divergence needed.
- **Science**: EXCLUDE — Not iterative/experimental
- **Prompting**: EXCLUDE — Not a meta-prompting task

## EXECUTE Phase

### Step 1: Read ALL Source Files
Read from `roles/{role-id}/TELOS/`:
- **6 Profile Files:** SKILLS.md, EXPERIENCE.md, INTERESTS.md, AVAILABILITY.md, CERTIFICATIONS.md, DOMAIN_EXPERTISE.md
- **4 Supporting Files:** MISSION.md, GOALS.md, CHALLENGES.md, BELIEFS.md

### Step 2: Synthesize Narrative Layer
This is the key difference from v1. The narrative layer is NOT a direct copy — it requires synthesis:

- **summary**: Read MISSION.md + EXPERIENCE.md + DOMAIN_EXPERTISE.md. Write a 3-4 sentence identity: who they are, what they do, what makes them distinctive. Written so a consuming system can immediately understand and represent this person.
- **mission**: Extract from MISSION.md first paragraph.
- **value_proposition**: Synthesize from MISSION.md + DOMAIN_EXPERTISE.md intersections + BELIEFS.md. What do they uniquely offer?
- **trajectory**: From MISSION.md career trajectory section + GOALS.md timeline.
- **operating_principles**: Extract from BELIEFS.md as array.
- **domain_intersections**: Extract from DOMAIN_EXPERTISE.md Domain Intersections section as array.
- **challenges_they_solve**: Extract from CHALLENGES.md as array.

### Step 3: Build Capabilities Layer (with motivation)
- **current_skills**: Parse SKILLS.md Technical + Domain + Soft skill tables. For each skill, synthesize a `why` field that connects it to their mission. Don't just say "years of experience" — say why this skill matters to what they're trying to do.
- **developing**: Parse SKILLS.md "Skills to Develop" tables (Tier 1, 2, 3). Include the `why` from the "Why Durable" column.
- **domain_expertise**: Parse DOMAIN_EXPERTISE.md Primary + Secondary tables.

### Step 4: Build Evidence Layer
- **career**: Parse EXPERIENCE.md Career History table.
- **projects**: Parse EXPERIENCE.md Project History table.
- **certifications**: Parse CERTIFICATIONS.md Credentials table.
- **education**: Parse CERTIFICATIONS.md Education table.

### Step 5: Build Signal Layer (Current State)
- **active_projects**: Parse AVAILABILITY.md Project Bandwidth table — only Active slots.
- **learning_goals**: Parse INTERESTS.md Learning Goals list (checkbox state).
- **availability**: Parse AVAILABILITY.md Current Capacity section.
- **seeking**: Extract from INTERESTS.md "Seeking mentorship in" list.
- **offering**: Extract from INTERESTS.md "Willing to mentor on" list.

### Step 6: Determine Role ID
Detect which role is active by reading MISSION.md content or checking switch-role state:
- Innovation Lead → `innovation-lead`
- R&D Scientist → `rd-scientist`
- Data Scientist → `data-scientist`

### Step 7: Write JSON
Write to `shared/profiles/{role-id}.json` with schema_version "2.0.0" and current ISO timestamp.

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence]:
- Validate JSON is well-formed (parse it back)
- Verify narrative.summary is synthesized (not just copied from MISSION.md)
- Verify skills have `why` fields populated
- Confirm 4-layer structure (narrative → capabilities → evidence → current_state)
- Confirm file was written to correct path

## LEARN Phase
Write to `MEMORY/LEARNING/TALENT_PROFILE/`:
```
# Learning: Profile Export v2.0.0 — [Date]
## Context — Which role was exported
## Insight — Quality of narrative synthesis, any gaps
## Implication — What would improve the narrative or schema
```

## Output
- Path to exported JSON file
- Summary: narrative quality, field completeness, any gaps
