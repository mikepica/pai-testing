---
name: ConstraintArticulator
version: 1.0.0
description: >
  Articulate domain-specific constraints using FirstPrinciples decomposition through The Algorithm.
  USE WHEN user says "articulate constraints", "respond to question", "answer the question",
  "respond to the innovation lead", "surface blockers", "what are my constraints".
  Classifies constraints as Hard/Soft/Assumption.
---

# ConstraintArticulator Skill

## Purpose
Help team members articulate domain-specific constraints using The Algorithm with FirstPrinciples as the primary thinking tool. Produces structured, classified constraint responses that the Innovation Lead can synthesize across roles.

## How This Skill Works With The Algorithm
Each workflow invokes The Algorithm. FirstPrinciples (Deconstruct/Challenge/Reconstruct) is the primary thinking tool. Constraints are classified using the Hard/Soft/Assumption taxonomy.

## Constraint Taxonomy
- **Hard** — Physics, biology, regulation. Cannot be engineered around. Examples: "minimum 18-month follow-up for PFS endpoints" (biology), "GDPR requires data anonymization" (regulation)
- **Soft** — Policy, process, organizational preference. Can be changed with effort and agreement. Examples: "we use SHAP for explainability" (internal policy), "compute budget is fixed for Q2" (process)
- **Assumption** — Untested belief. Needs validation before treating as constraint. Examples: "historical data is representative of future trials" (untested), "protocol PDFs can be reliably parsed" (untested)

## Workflow Routing
| Workflow | Trigger | File |
|----------|---------|------|
| **RespondToQuestion** | "respond", "answer", question from Innovation Lead | `Workflows/RespondToQuestion.md` |
| **SurfaceBlockers** | "surface blockers", "what are my constraints" | `Workflows/SurfaceBlockers.md` |

## Examples (REQUIRED)

### Example 1: Respond to Innovation Lead's questions
**User**: "Respond to the Innovation Lead's questions about the clinical trial predictor"
**Behavior**: Routes to RespondToQuestion → reads from $SHARED_DIR/questions/ → FirstPrinciples decomposes each question → constraint table with Hard/Soft/Assumption classification → writes response to $SHARED_DIR/responses/

### Example 2: Proactively surface blockers
**User**: "What constraints do I have around clinical trial prediction?"
**Behavior**: Routes to SurfaceBlockers → loads TELOS → FirstPrinciples deconstructs the domain → identifies and classifies all constraints by impact

## Key Principle
Every response uses FirstPrinciples decomposition and classifies every constraint. Every execution ends with LEARN phase writing to `MEMORY/LEARNING/CONSTRAINTS/`.

## Algorithm Format Rules (apply to all workflows)
When The Algorithm executes these workflows:
- First output token MUST be 🤖 (triggers Algorithm format)
- Response depth is classified: FULL for evaluations/synthesis, ITERATION for refinements
- OBSERVE phase begins with reverse-engineering the user's request
- ISC managed via TaskCreate/TaskList/TaskUpdate — never manual tables
- THINK phase includes mandatory Thinking Tools Assessment with justify-exclusion
