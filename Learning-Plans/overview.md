# Hands-On Learning Guide: AZ Demo Setup

A step-by-step walkthrough to experience every moving part of the PAI v2.5 + role-switching demo. You'll play each persona, trigger each system, and see how they connect.

**Time estimate:** 60-90 minutes for the full walkthrough. Each act is independent — you can pause between them.

**Prerequisites:**
- Bun installed (`bun --version`)
- Claude Code CLI available (`claude --version`)
- You're in the `~/Personal_Projects/az-demo/` directory

---

## Act 1: Orientation — Understand What You're Working With

Before touching anything, get the lay of the land.

### Step 1.1: Inspect the directory structure
```bash
cd ~/Personal_Projects/az-demo
tree -L 3 -I 'node_modules' --dirsfirst
```
Notice:
- `.claude/` — the single PAI v2.5 install (shared across all roles)
- `roles/` — 3 persona configs that get swapped in
- `shared/` — cross-role coordination artifacts (questions, responses)
- `switch-role.sh` — the role-switching script

### Step 1.2: Read the switch-role script
```bash
cat switch-role.sh
```
Understand: it copies TELOS + SKILLCUSTOMIZATIONS from `roles/<name>/` into `.claude/skills/PAI/USER/`. That's all role-switching is — a file swap.

### Step 1.3: See what's in settings.json
```bash
cat .claude/settings.json | head -20
```
Notice:
- `SHARED_DIR` env var — tells skills where to read/write shared artifacts
- `contextFiles` — files loaded at every session start (includes custom skills)
- `hooks` — lifecycle hooks that fire on prompts, tool use, session events

### Step 1.4: Check the installed skills
```bash
ls .claude/skills/
```
You should see: `Agents`, `BeCreative`, `ConstraintArticulator`, `Council`, `FirstPrinciples`, `IdeaPipeline`, `PAI`, `THEALGORITHM`, `RedTeam`, and others.

---

## Act 2: Be the Innovation Lead (Alex Rivera)

You're an innovation portfolio manager who evaluates AI project ideas across R&D.

### Step 2.1: Switch to Innovation Lead
```bash
./switch-role.sh innovation-lead
```

### Step 2.2: Verify what got swapped
```bash
cat .claude/skills/PAI/USER/TELOS/MISSION.md
cat .claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/Council/PREFERENCES.md
cat .claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/THEALGORITHM/PREFERENCES.md
```
Notice:
- MISSION.md describes Alex Rivera's role and value proposition
- Council PREFERENCES gives you 3 custom perspectives (Scientific Merit, Feasibility, Risk)
- Algorithm PREFERENCES sets effort defaults (THOROUGH for evaluations)

### Step 2.3: Start a Claude session
```bash
claude
```
Watch the startup:
- **StartupGreeting hook** fires — you'll see PAI's greeting
- **LoadContext hook** fires — loads contextFiles (TELOS, skills, steering rules)
- The AI now "knows" it's working with Alex Rivera

### Step 2.4: Ask about your identity
Try these prompts one at a time and observe what happens:

**Prompt 1 — See TELOS in action:**
```
What are my biggest challenges right now?
```
The AI should draw from your CHALLENGES.md — translation gaps, invisible constraints, etc.

**Prompt 2 — See your projects:**
```
What's the status of my projects?
```
It should reference your PROJECTS.md — the Clinical Trial Predictor, Lab Notebook NLP, etc.

**Prompt 3 — See your mental models:**
```
How do I think about evaluating ideas?
```
It should surface your MODELS.md (Translation Gap, Constraint Iceberg, Portfolio Thinking).

### Step 2.5: Trigger The Algorithm (IdeaPipeline)
This is the big one. Type:
```
Evaluate this idea: using ML to predict clinical trial success probability based on historical AstraZeneca trial data
```

Watch for:
- **FormatReminder hook** fires first (Two-Pass Capability Selection, Pass 1) — suggests depth/skills
- **AutoWorkCreation hook** fires — creates a WORK entry in MEMORY
- The Algorithm activates (first token should be the robot emoji)
- **OBSERVE phase** — reverse-engineers your request, creates ISC criteria via tasks
- **THINK phase** — Thinking Tools Assessment with justify-exclusion for each tool
- **Council** gets INCLUDED with your 3 custom perspectives
- **PLAN phase** — assigns capabilities to ISC criteria
- **EXECUTE phase** — Council Quick runs with Scientific Merit / Feasibility / Risk perspectives
- **VERIFY phase** — ISC criteria checked (DONE / ADJUSTED / BLOCKED)
- **LEARN phase** — writes to `MEMORY/LEARNING/IDEA_EVALUATION/`

This is the core loop. Let it run fully.

### Step 2.6: Generate questions for the team
```
Generate questions for the team about the clinical trial predictor
```

Watch for:
- Routes to GenerateQuestions workflow
- Reads BLOCKED ISC rows from the evaluation
- Writes question files to `shared/questions/clinical-trial-predictor/`
- Questions are targeted per role (R&D scientist gets biology questions, data scientist gets ML questions)

### Step 2.7: Check what was written
Exit Claude (`/exit` or Ctrl+C), then:
```bash
ls shared/questions/clinical-trial-predictor/
cat shared/questions/clinical-trial-predictor/rd-scientist.md
cat shared/questions/clinical-trial-predictor/data-scientist.md
```

### Step 2.8: Check MEMORY
```bash
ls .claude/MEMORY/WORK/
ls .claude/MEMORY/LEARNING/IDEA_EVALUATION/
```
The AutoWorkCreation hook should have created a work entry, and the LEARN phase should have written an evaluation learning.

### Step 2.9: Synthesize existing responses
Start Claude again and try:
```
What did the team say about the clinical trial predictor?
```
This triggers SynthesizeResponses — it reads the pre-populated Data Scientist response from `shared/responses/clinical-trial-predictor/data-scientist-response.md` and cross-references constraints.

Exit Claude when done.

---

## Act 3: Be the R&D Scientist (Dr. Sarah Okonkwo)

You're a bench scientist who runs assays and validates drug candidates. You're skeptical of AI predictions.

### Step 3.1: Switch roles
```bash
./switch-role.sh rd-scientist
```

### Step 3.2: Verify identity shift
```bash
cat .claude/skills/PAI/USER/TELOS/MISSION.md
cat .claude/skills/PAI/USER/TELOS/BELIEFS.md
cat .claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/THEALGORITHM/PREFERENCES.md
```
Notice the shift:
- Mission is about experiments and ground truth, not portfolio management
- Beliefs emphasize reproducibility and skepticism of AI
- Algorithm preferences use **FirstPrinciples as primary** (not Council)

### Step 3.3: Start Claude and feel the persona
```bash
claude
```

**Prompt 1 — Identity check:**
```
What do I believe about AI in drug discovery?
```
Should surface Sarah's beliefs — biology is messy, reproducibility is non-negotiable, false negatives are catastrophic.

**Prompt 2 — See your challenges:**
```
What frustrates me about working with data scientists?
```
Should draw from CHALLENGES.md — they don't understand assay timelines, they call variability "noise", etc.

### Step 3.4: Check for pending questions
```
Do I have any questions from the Innovation Lead?
```
This should read from `shared/questions/clinical-trial-predictor/rd-scientist.md` and show you the pending questions.

### Step 3.5: Trigger ConstraintArticulator
```
Respond to the Innovation Lead's questions about the clinical trial predictor
```

Watch for:
- Routes to RespondToQuestion workflow
- The Algorithm activates with **FirstPrinciples** (not Council — check the THINK phase)
- **Deconstruct** — breaks each question into fundamentals
- **Challenge** — identifies untested assumptions in the questions
- **Reconstruct** — classifies constraints as Hard/Soft/Assumption
- Writes response to `shared/responses/clinical-trial-predictor/rd-scientist-response.md`

### Step 3.6: Try proactive constraint surfacing
```
What constraints do I have around clinical trial prediction?
```
This triggers SurfaceBlockers — FirstPrinciples deconstructs the topic against Sarah's TELOS.

### Step 3.7: Verify output
Exit Claude, then:
```bash
cat shared/responses/clinical-trial-predictor/rd-scientist-response.md
ls .claude/MEMORY/LEARNING/CONSTRAINTS/
```
You should see the constraint-classified response and a learning entry.

---

## Act 4: Be the Data Scientist (Priya Mehta)

You build ML models. You care about data quality, explainability, and compute budgets.

### Step 4.1: Switch roles
```bash
./switch-role.sh data-scientist
```

### Step 4.2: Verify identity shift
```bash
cat .claude/skills/PAI/USER/TELOS/MISSION.md
cat .claude/skills/PAI/USER/TELOS/MODELS.md
```
Notice: Mission is about ML models and extracting value from data. Mental models include the 70/20/10 Rule and Modality Transfer Gap.

### Step 4.3: Start Claude and explore
```bash
claude
```

**Prompt 1 — Feel the persona:**
```
What's my biggest bottleneck right now?
```
Should surface data wrangling (70% of time), data access, compute budget.

**Prompt 2 — See mental models:**
```
Should I build one general model or specialized models for different drug modalities?
```
Should draw from MODELS.md (Modality Transfer Gap) and STRATEGIES.md (Start With Largest Clean Dataset).

### Step 4.4: Respond to Innovation Lead
```
Respond to the Innovation Lead's questions about the clinical trial predictor
```

Watch how the Data Scientist's response differs from the R&D Scientist's:
- Different constraints (data volume, compute, explainability vs. endpoint trust, validation timelines)
- Different FirstPrinciples decomposition (ML architecture choices vs. biology concerns)
- Same Hard/Soft/Assumption taxonomy, different classifications

### Step 4.5: Surface your own blockers
```
What constraints do I have around building a clinical trial success predictor?
```

Compare this output to Sarah's constraints from Act 3 — the cross-role contrast is the whole point of the demo.

Exit Claude when done.

---

## Act 5: Cross-Role Synthesis (Back to Innovation Lead)

Now see how the pieces come together.

### Step 5.1: Switch back to Innovation Lead
```bash
./switch-role.sh innovation-lead
claude
```

### Step 5.2: Synthesize all team responses
```
Synthesize the team's responses about the clinical trial predictor
```

Watch for:
- Reads ALL response files from `shared/responses/clinical-trial-predictor/`
- Cross-references constraints across roles
- Identifies **conflicts** (e.g., R&D wants 18-month follow-up endpoints vs. Data Science wants 500+ trials)
- Surfaces **shared assumptions** (both roles may flag data quality concerns)
- Produces updated recommendation (PROCEED / PROCEED WITH CONSTRAINTS / NEEDS MORE INPUT / REJECT)

### Step 5.3: Refine the idea
```
Refine the clinical trial predictor idea based on the team's input
```
This triggers RefineIdea — proposes scope adjustments to address HARD constraints and validation plans for ASSUMPTIONs.

Exit Claude when done.

---

## Act 6: Inspect the Machinery

Now that you've run through the loop, inspect what happened under the hood.

### Step 6.1: Check all MEMORY
```bash
echo "=== WORK ==="
ls .claude/MEMORY/WORK/

echo "=== IDEA EVALUATION LEARNINGS ==="
ls .claude/MEMORY/LEARNING/IDEA_EVALUATION/
cat .claude/MEMORY/LEARNING/IDEA_EVALUATION/*.md 2>/dev/null | head -40

echo "=== CONSTRAINT LEARNINGS ==="
ls .claude/MEMORY/LEARNING/CONSTRAINTS/
cat .claude/MEMORY/LEARNING/CONSTRAINTS/*.md 2>/dev/null | head -40

echo "=== ALGORITHM LEARNINGS ==="
ls .claude/MEMORY/LEARNING/ALGORITHM/
```

### Step 6.2: Check shared artifacts
```bash
echo "=== Questions sent ==="
ls shared/questions/clinical-trial-predictor/

echo "=== Responses received ==="
ls shared/responses/clinical-trial-predictor/

echo "=== Ideas ==="
ls shared/ideas/
```

### Step 6.3: Inspect hooks
```bash
echo "=== Hooks that fired ==="
cat .claude/hooks/FormatReminder.hook.ts | head -30   # Two-Pass Capability Selection
cat .claude/hooks/AutoWorkCreation.hook.ts | head -30  # Auto WORK entry creation
```

### Step 6.4: Compare SKILLCUSTOMIZATIONS across roles
```bash
echo "=== Innovation Lead: Council ==="
cat roles/innovation-lead/CUSTOMIZATIONS/Council/PREFERENCES.md

echo "=== R&D Scientist: Algorithm ==="
cat roles/rd-scientist/CUSTOMIZATIONS/THEALGORITHM/PREFERENCES.md

echo "=== Data Scientist: Algorithm ==="
cat roles/data-scientist/CUSTOMIZATIONS/THEALGORITHM/PREFERENCES.md
```
Notice how the same Algorithm engine produces different behavior per role based on PREFERENCES.

---

## Key Concepts Cheat Sheet

| Concept | Where It Lives | What It Does |
|---------|---------------|--------------|
| **TELOS** | `.claude/skills/PAI/USER/TELOS/` | AI identity — mission, goals, beliefs, mental models |
| **The Algorithm** | `.claude/skills/THEALGORITHM/` | Execution engine — OBSERVE/THINK/PLAN/EXECUTE/VERIFY/LEARN |
| **ISC** | Created via tasks during Algorithm execution | Tracks success criteria with DONE/ADJUSTED/BLOCKED status |
| **Council** | `.claude/skills/Council/` | Multi-perspective debate (3 custom perspectives for Innovation Lead) |
| **FirstPrinciples** | `.claude/skills/FirstPrinciples/` | Deconstruct/Challenge/Reconstruct (primary for R&D + Data Science) |
| **SKILLCUSTOMIZATIONS** | `.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/` | Per-role overrides for how skills behave |
| **IdeaPipeline** | `.claude/skills/IdeaPipeline/` | Innovation Lead's evaluation workflows |
| **ConstraintArticulator** | `.claude/skills/ConstraintArticulator/` | Team member constraint response workflows |
| **Hooks** | `.claude/hooks/` | Lifecycle triggers (format reminder, auto-work, ratings) |
| **MEMORY** | `.claude/MEMORY/` | Persistent learning across sessions |
| **Shared artifacts** | `shared/` | Cross-role coordination (questions, responses, ideas) |
| **switch-role.sh** | Project root | Swaps TELOS + CUSTOMIZATIONS to change persona |

---

## Troubleshooting

**Algorithm doesn't activate:** Make sure you see the robot emoji as the first token. If not, try being more explicit: "Use The Algorithm to evaluate this idea."

**Council doesn't use custom perspectives:** Check that SKILLCUSTOMIZATIONS were swapped correctly: `cat .claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/Council/PREFERENCES.md`

**Hooks timeout:** FormatReminder requires Bun. If it times out (10s), the Algorithm defaults to FULL depth — this is fine for learning.

**No MEMORY files created:** The LEARN phase only writes if The Algorithm runs fully. Make sure you let it complete without interrupting.

**Shared artifacts not found:** Check `SHARED_DIR` in settings.json points to the correct path: `~/Personal_Projects/az-demo/shared`
