# UpdateProfile Workflow

## Trigger
User asks to update their profile, add a skill, update availability, or modify any profile TELOS file.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at ITERATION effort for single-field updates, FULL effort for multi-file updates.

## OBSERVE Phase — ISC Creation
⚠️ CREATE ISC TASKS NOW using TaskCreate. Do NOT use manual tables.

Create ISC criteria based on what the user wants to update (8 words, state-not-action, binary testable):

Example criteria:
1. "Target profile file identified from user request" — Source: EXPLICIT
2. "Current file content read before any modification" — Source: IMPLICIT
3. "Change applied preserving existing table structure format" — Source: INFERRED
4. "Updated content verified against original for accuracy" — Source: IMPLICIT

🎯 ISC Tasks:
[INVOKE TaskList — this is the source of truth, NO manual tables]

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: EXCLUDE — Single clear update, no competing approaches
- **FirstPrinciples**: EXCLUDE — Straightforward data update, no assumptions to challenge
- **RedTeam**: EXCLUDE — Not a proposal to stress-test
- **BeCreative**: EXCLUDE — Structured update, no divergence needed
- **Science**: EXCLUDE — Not experimental
- **Prompting**: EXCLUDE — Not a meta-prompting task

## EXECUTE Phase

### Step 1: Identify Target Files
Map the user's request to specific profile files:
- Skills/tools/languages → `SKILLS.md`
- Jobs/career/projects → `EXPERIENCE.md`
- Interests/learning/mentoring → `INTERESTS.md`
- Availability/capacity/schedule → `AVAILABILITY.md`
- Certifications/education/publications → `CERTIFICATIONS.md`
- Domains/expertise/depth → `DOMAIN_EXPERTISE.md`

### Step 2: Read Current State
Read the target file(s) to understand current content and structure.

### Step 3: Cross-File Awareness
Check if the update affects multiple files:
- New project completed → update EXPERIENCE.md (project history) + SKILLS.md (skills used) + possibly AVAILABILITY.md (freed capacity)
- New certification → update CERTIFICATIONS.md + possibly SKILLS.md (proficiency upgrade)
- Role change → may affect multiple files

### Step 4: Apply Changes
Use Edit tool to modify the specific sections. Preserve existing table structure and formatting.

### Step 5: Update Timestamps
Set `Last Used` dates in SKILLS.md and `Last updated` in AVAILABILITY.md as appropriate.

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence]:
- Read modified file to confirm change was applied correctly
- Verify table structure is intact
- Confirm no data was lost

## LEARN Phase
Write to `MEMORY/LEARNING/TALENT_PROFILE/`:
```
# Learning: Profile Update — [Date]
## Context — What was updated and why
## Insight — Cross-file implications detected
## Implication — Patterns for future profile maintenance
```

## Output
- Which file(s) were modified
- Summary of changes applied
- Any cross-file updates suggested but not applied (ask user)
