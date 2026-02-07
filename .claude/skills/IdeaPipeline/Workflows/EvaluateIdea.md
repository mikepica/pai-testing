# EvaluateIdea Workflow

## Trigger
User asks to evaluate, assess, or score an AI project idea.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at THOROUGH effort. Do not skip phases.

## OBSERVE Phase — ISC Creation
⚠️ CREATE ISC TASKS NOW using TaskCreate. Do NOT use manual tables.

Create these ISC criteria (8 words, state-not-action, binary testable):

1. "Scientific merit score assigned for this idea" — Source: EXPLICIT
2. "Implementation feasibility assessed with current AZ infra" — Source: EXPLICIT
3. "ROI estimate documented with value and cost" — Source: INFERRED
4. "Risk assessment covers regulatory safety organizational" — Source: INFERRED
5. "Timeline to pilot fits eight week target" — Source: INFERRED
6. "Key assumptions surfaced and individually classified" — Source: IMPLICIT
7. "Gaps requiring team input explicitly identified" — Source: IMPLICIT

🎯 ISC Tasks:
[INVOKE TaskList — this is the source of truth, NO manual tables]

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: INCLUDE — Multiple valid perspectives needed for evaluation (see SKILLCUSTOMIZATIONS/Council/PREFERENCES.md for the 3 domain-specific perspectives)
- **FirstPrinciples**: INCLUDE — Assumptions about data availability and biological validity need challenging
- **RedTeam**: EXCLUDE at THOROUGH — Will use after team input at DETERMINED if needed
- **BeCreative**: EXCLUDE — Structured evaluation, not divergent ideation
- **Science**: EXCLUDE — Not hypothesis-testing at this stage
- **Prompting**: EXCLUDE — Not a meta-prompting task

## PLAN Phase — Capability Assignment
Assign capabilities to ISC criteria via TaskUpdate:
- Criteria 1-5: Council Quick (3 domain perspectives)
- Criterion 6: FirstPrinciples (Deconstruct assumptions)
- Criterion 7: Derived from Council output (gaps = perspective disagreements)

## EXECUTE Phase
1. Run Council Quick with the 3 perspectives from SKILLCUSTOMIZATIONS
2. Run FirstPrinciples on the key assumptions surfaced
3. Compile evaluation scores per criterion
4. Identify gaps that require team member input

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence and status]:
- DONE — criterion met with evidence
- ADJUSTED — criterion modified based on findings
- BLOCKED — gap requires team input → feeds into GenerateQuestions

## LEARN Phase
Write to `MEMORY/LEARNING/IDEA_EVALUATION/`:
```
# Learning: [Idea Title] Evaluation — [Date]
## Context — What idea was evaluated
## Insight — What the evaluation revealed
## Evidence — Key constraint or finding that drove the assessment
## Implication — How this changes future evaluation approach
```

## Output
Structured evaluation with:
- Scores per criterion (1-5)
- ISC table showing status of each criterion
- Key assumptions classified (via FirstPrinciples)
- Gaps requiring team input (BLOCKED ISC rows)
- Overall recommendation: PROCEED / NEEDS INPUT / REJECT
