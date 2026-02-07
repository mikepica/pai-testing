# RespondToQuestion Workflow

## Trigger
User asks to respond to a question from the Innovation Lead, or to answer pending questions.

## Algorithm Integration
Runs through The Algorithm at STANDARD effort.

## OBSERVE Phase
1. Read pending question file from `$SHARED_DIR/questions/{idea-id}/{this-role}.md`
2. Load user's TELOS for domain context
3. ⚠️ CREATE ISC TASKS NOW using TaskCreate for each question:
   - 8 words, state-not-action, binary testable
   - Example: "Q1 constraint classification table complete with evidence"

## THINK Phase — Thinking Tools Assessment (justify exclusion)
🔍 THINKING TOOLS ASSESSMENT (justify exclusion):
│ FirstPrinciples:  INCLUDE — Need to deconstruct question, challenge assumptions, classify constraints
│ Council:          EXCLUDE — Single-domain response, no competing perspectives needed
│ RedTeam:          EXCLUDE — Not adversarial stress-testing, domain constraint articulation
│ BeCreative:       EXCLUDE — Structured constraint output, not divergent ideation
│ Science:          EXCLUDE — Not hypothesis-testing or experimental design
│ Prompting:        EXCLUDE — Not a meta-prompting task

## EXECUTE Phase — FirstPrinciples Decomposition
For each question:

1. **Deconstruct** — Break the question into fundamental components. What is actually being asked? What domain knowledge does this require?

2. **Challenge** — Which assumptions in the question are untested? What does the questioner take for granted that may not be true?

3. **Reconstruct** — What constraints actually exist? Classify each:

| Constraint | Type | Detail |
|------------|------|--------|
| [Specific constraint] | HARD/SOFT/ASSUMPTION | [Why this classification, what evidence] |

## Output
Write structured response to `$SHARED_DIR/responses/{idea-id}/{role}-response.md`:

```yaml
---
idea_id: [id]
from_role: [this-role]
to_role: innovation-lead
constraint_summary:
  hard: [count]
  soft: [count]
  assumption: [count]
---
```

Followed by:
- Per-question constraint classification table
- FirstPrinciples analysis (Deconstructed/Challenged/Reconstructed)
- Counter-questions if the original question contained untested assumptions

## LEARN Phase
Write to `MEMORY/LEARNING/CONSTRAINTS/`:
- What constraint patterns emerged
- Which assumptions were most commonly untested
- What domain knowledge was most relevant
