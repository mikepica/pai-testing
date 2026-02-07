# GenerateQuestions Workflow

## Trigger
User asks to generate questions for the team, ask the team, or follow up on BLOCKED ISC rows from an evaluation.

## Algorithm Integration
Runs through The Algorithm at STANDARD effort.

## Process
1. Read the evaluation output (or active ISC) to identify gaps
2. For each gap, determine which team role has the domain expertise to address it
3. Generate targeted questions per role with:
   - **Context**: Why this question matters for the evaluation
   - **What would help**: What kind of answer advances the decision
   - **Expected constraint type**: Hard (biology/physics), Soft (policy/process), or Assumption (untested belief)

## Output
Write question files to `$SHARED_DIR/questions/{idea-id}/`:
- `rd-scientist.md` — Questions requiring experimental/biology expertise
- `data-scientist.md` — Questions requiring ML/data expertise

Each file has YAML frontmatter:
```yaml
---
idea_id: [kebab-case-id]
from_role: innovation-lead
to_role: [target-role]
status: PENDING
---
```

## LEARN Phase
Write to `MEMORY/LEARNING/IDEA_EVALUATION/` what types of questions were needed and for which roles.
