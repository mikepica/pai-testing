# IdeaPipeline Skill

**Version:** 1.0.0

Evaluate, refine, and coordinate on AI project ideas for the R&D portfolio. IdeaPipeline provides a structured, multi-stage workflow for taking raw ideas from discovery through team evaluation to a go/no-go decision.

---

## How It Works

IdeaPipeline is **not a standalone execution engine**. It works with **The Algorithm** (PAI's universal execution engine) as the runtime. Each workflow defines:

- **ISC criteria** to create and track (via `TaskCreate` / `TaskList` / `TaskUpdate`)
- **Thinking tools** to invoke (Council, FirstPrinciples, etc.)
- **Capability agents** to spawn (researchers, analysts)

The Algorithm handles phased execution (OBSERVE through LEARN), effort classification, and verification. IdeaPipeline provides the domain-specific logic for idea evaluation.

Every execution ends with the **LEARN** phase writing insights to `MEMORY/LEARNING/IDEA_EVALUATION/`.

---

## Workflows

### 1. EvaluateIdea

**Trigger phrases:** `"evaluate"`, `"assess"`, `"score"` an idea

**What it does:** Runs a structured evaluation of an AI project idea, producing scores, surfaced assumptions, and identified gaps.

**Effort level:** THOROUGH (full 7-phase Algorithm execution)

**ISC criteria created (7):**

| # | Criterion | Source |
|---|-----------|--------|
| 1 | Scientific merit score assigned for this idea | EXPLICIT |
| 2 | Implementation feasibility assessed with current infra | EXPLICIT |
| 3 | ROI estimate documented with value and cost | INFERRED |
| 4 | Risk assessment covers regulatory, safety, organizational | INFERRED |
| 5 | Timeline to pilot fits eight-week target | INFERRED |
| 6 | Key assumptions surfaced and individually classified | IMPLICIT |
| 7 | Gaps requiring team input explicitly identified | IMPLICIT |

**Thinking tools used:**
- **Council** (Quick, 3 perspectives) -- Multiple domain viewpoints needed for scoring
- **FirstPrinciples** -- Challenge and classify assumptions

**Output:** Per-criterion scores (1-5), ISC status table, classified assumptions, identified gaps (BLOCKED rows), and an overall recommendation: `PROCEED` / `NEEDS INPUT` / `REJECT`.

---

### 2. GenerateQuestions

**Trigger phrases:** `"generate questions"`, `"ask the team"`

**What it does:** Reads BLOCKED ISC rows from a prior evaluation and generates targeted, role-specific questions for team members.

**Effort level:** STANDARD

**Process:**
1. Identify gaps from BLOCKED ISC criteria
2. Match each gap to the team role with relevant domain expertise
3. Generate questions with context, expected answer type, and anticipated constraint classification

**Output location:** `$SHARED_DIR/questions/{idea-id}/`

**Output files per role (examples):**
- `rd-scientist.md` -- Questions requiring experimental/biology expertise
- `data-scientist.md` -- Questions requiring ML/data expertise

Each file includes YAML frontmatter:

```yaml
---
idea_id: ml-trial-predictor
from_role: innovation-lead
to_role: rd-scientist
status: PENDING
---
```

---

### 3. SynthesizeResponses

**Trigger phrases:** `"synthesize"`, `"combine responses"`, `"what did the team say"`

**What it does:** Reads team response files, cross-references constraints across roles, identifies conflicts and agreements, and produces a synthesis brief.

**Effort level:** THOROUGH

**Input location:** `$SHARED_DIR/responses/{idea-id}/`

**Process:**
1. Read all response files from the shared responses directory
2. Extract constraint classification tables (Hard / Soft / Assumption) from each
3. Cross-reference constraints across roles:
   - **Conflicts** -- Hard constraint vs. Hard constraint across roles
   - **Challenged assumptions** -- Overlapping assumptions from multiple roles
   - **Agreements** -- Independent confirmation of the same constraint
4. Update ISC rows: BLOCKED becomes DONE or ADJUSTED based on team input
5. Produce a synthesis brief with an updated recommendation

**Output:** Constraint summary table, conflict analysis, assumption validation status, and updated recommendation: `PROCEED` / `PROCEED WITH CONSTRAINTS` / `NEEDS MORE INPUT` / `REJECT`.

---

### 4. RefineIdea

**Trigger phrases:** `"refine"`, `"iterate"`, `"update idea"`

**What it does:** Takes the synthesis results and proposes concrete adjustments to the idea scope, plus validation plans for untested assumptions.

**Effort level:** STANDARD

**Process:**
1. Read the synthesis brief
2. Propose scope adjustments to address HARD constraints
3. Propose validation plans to test ASSUMPTIONs
4. Re-score the refined idea against the original criteria
5. Track refinement iteration count

**Output:** Adjusted scope description, validation plan, updated scores, iteration history.

---

## Workflow Chain

The four workflows form a sequential pipeline for idea evaluation:

```
EvaluateIdea ──> GenerateQuestions ──> SynthesizeResponses ──> RefineIdea
     │                  │                      │                    │
  7 ISC criteria    Questions to          Synthesis brief      Refined idea
  Scores + gaps     team roles            Conflict analysis    Scope adjustments
  BLOCKED rows      $SHARED_DIR/          Updated ISC          Re-scored criteria
                    questions/
```

Each stage feeds the next. The chain can iterate: after RefineIdea, you can run EvaluateIdea again on the refined version.

---

## Shared Directory Structure

IdeaPipeline coordinates across team roles using a shared filesystem:

```
$SHARED_DIR/
  questions/
    {idea-id}/
      rd-scientist.md        # Questions for R&D scientist
      data-scientist.md      # Questions for data scientist
  responses/
    {idea-id}/
      rd-scientist.md        # R&D scientist's constraint responses
      data-scientist.md      # Data scientist's constraint responses
```

- **Questions** are written by the Innovation Lead (via GenerateQuestions)
- **Responses** are written by team members (via the ConstraintArticulator skill)
- **Synthesis** reads from the responses directory

---

## Constraint Taxonomy

Team responses use a shared classification system:

| Type | Definition | Example |
|------|-----------|---------|
| **Hard** | Physics, biology, regulation. Cannot be engineered around. | "Minimum 18-month follow-up for PFS endpoints" |
| **Soft** | Policy, process, organizational. Can be changed with effort. | "Compute budget is fixed for Q2" |
| **Assumption** | Untested belief. Needs validation. | "Historical data is representative of future trials" |

---

## Usage Examples

### Evaluate a new idea
```
"Evaluate this idea: using ML to predict clinical trial success probability"
```
Routes to **EvaluateIdea**. Runs Council with 3 domain perspectives, FirstPrinciples on assumptions. Outputs structured evaluation with scores, assumptions, and gaps.

### Generate follow-up questions
```
"Generate questions for the team about the clinical trial predictor"
```
Routes to **GenerateQuestions**. Reads BLOCKED ISC rows, writes role-targeted question files to `$SHARED_DIR/questions/`.

### Synthesize team responses
```
"What did the team say about the clinical trial predictor?"
```
Routes to **SynthesizeResponses**. Reads all responses from `$SHARED_DIR/responses/`, cross-references constraints, identifies conflicts, updates ISC.

### Refine based on feedback
```
"Refine the clinical trial predictor idea based on what we learned"
```
Routes to **RefineIdea**. Proposes scope adjustments for hard constraints, validation plans for assumptions, re-scores.

---

## Algorithm Format Rules

When The Algorithm executes IdeaPipeline workflows:

- First output token is always the Algorithm header
- Response depth: **FULL** for evaluations and synthesis, **ITERATION** for refinements
- OBSERVE phase reverse-engineers the user's request
- ISC managed exclusively via `TaskCreate` / `TaskList` / `TaskUpdate` (never manual tables)
- THINK phase includes mandatory Thinking Tools Assessment with justify-exclusion principle
- LEARN phase writes to `MEMORY/LEARNING/IDEA_EVALUATION/`

---

## Memory Integration

Every workflow execution writes a learning file to:

```
MEMORY/LEARNING/IDEA_EVALUATION/{idea-id}-{date}.md
```

Learning files capture:
- **Context** -- What idea was evaluated
- **Insight** -- What the evaluation revealed
- **Evidence** -- Key constraint or finding
- **Implication** -- How this changes future approach

These learnings inform future evaluations, building institutional knowledge about what types of ideas succeed and what common blockers look like.

---

## Related Skills

| Skill | Relationship |
|-------|-------------|
| **ConstraintArticulator** | Team members use this to respond to IdeaPipeline questions with classified constraints |
| **Council** | Used within EvaluateIdea for multi-perspective scoring |
| **FirstPrinciples** | Used within EvaluateIdea to decompose and classify assumptions |
| **The Algorithm** | Execution engine for all workflows |
