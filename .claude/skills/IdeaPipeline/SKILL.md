---
name: IdeaPipeline
version: 1.0.0
description: >
  Evaluate, refine, and coordinate on AI project ideas for the R&D portfolio.
  USE WHEN user says "evaluate idea", "assess idea", "score project",
  "generate questions", "ask the team", "synthesize responses", "refine idea".
  Works with The Algorithm as the execution engine.
---

# IdeaPipeline Skill

## Purpose
Help the Innovation Lead evaluate AI project ideas sourced from AIXplore using The Algorithm's structured execution. This skill provides domain-specific workflows; The Algorithm provides the execution engine (effort classification, ISC tracking, capability selection, phased execution).

## How This Skill Works With The Algorithm
This skill does NOT bypass The Algorithm. Each workflow below describes what ISC rows to create and which thinking tools are relevant. The Algorithm handles execution, verification, and learning.

## Workflow Routing
| Workflow | Trigger | File |
|----------|---------|------|
| **EvaluateIdea** | "evaluate", "assess", "score" an idea | `Workflows/EvaluateIdea.md` |
| **GenerateQuestions** | "generate questions", "ask the team" | `Workflows/GenerateQuestions.md` |
| **SynthesizeResponses** | "synthesize", "combine responses" | `Workflows/SynthesizeResponses.md` |
| **RefineIdea** | "refine", "iterate", "update idea" | `Workflows/RefineIdea.md` |

## Examples (REQUIRED)

### Example 1: Evaluate a new idea
**User**: "Evaluate this idea: using ML to predict clinical trial success probability"
**Behavior**: Routes to EvaluateIdea → Algorithm runs at THOROUGH → Council debates with 3 perspectives → ISC tracks 7 criteria → outputs structured evaluation with scores, assumptions, and gaps

### Example 2: Generate follow-up questions
**User**: "Generate questions for the team about the clinical trial predictor"
**Behavior**: Routes to GenerateQuestions → reads BLOCKED ISC rows → writes role-targeted question files to $SHARED_DIR/questions/

### Example 3: Synthesize team responses
**User**: "What did the team say about the clinical trial predictor?"
**Behavior**: Routes to SynthesizeResponses → reads all responses from $SHARED_DIR/responses/ → cross-references constraints → identifies conflicts → updates ISC

## Key Principle
Every workflow invokes The Algorithm. Every execution ends with the LEARN phase writing to `MEMORY/LEARNING/IDEA_EVALUATION/`.

## Algorithm Format Rules (apply to all workflows)
When The Algorithm executes these workflows:
- First output token MUST be 🤖 (triggers Algorithm format)
- Response depth is classified: FULL for evaluations/synthesis, ITERATION for refinements
- OBSERVE phase begins with reverse-engineering the user's request
- ISC managed via TaskCreate/TaskList/TaskUpdate — never manual tables
- THINK phase includes mandatory Thinking Tools Assessment with justify-exclusion
