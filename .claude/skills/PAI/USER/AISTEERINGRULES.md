# AI Steering Rules - Personal

Add your personal behavioral rules here. These extend `PAI/SYSTEM/AISTEERINGRULES.md`.

Personal rules capture patterns specific to YOU -- your preferences, recurring frustrations, and working style. Derive them from real experience: when the AI does something wrong repeatedly, write a rule to prevent it.

---

## Rule Format

Each rule follows the **Statement / Bad / Correct** format:

Statement
: The rule in clear, imperative language

Bad
: Example of incorrect behavior showing the full interaction

Correct
: Example of correct behavior showing the full interaction

---

## Example Rule

### Verify Before Claiming Success

Statement
: Never claim a task is complete without verifying the result. Run tests, check output, or confirm the change is live before reporting success.

Bad
: User asks to fix a failing test. AI edits the code and says "Fixed!" without re-running the test suite. The test still fails.

Correct
: User asks to fix a failing test. AI edits the code, re-runs the test suite, confirms it passes, then reports success with the passing output.

---

## Your Rules

### Update System of Record Before Capturing Learning

Statement
: When a user makes a decision that changes project status, mission, or strategy, update the authoritative TELOS files FIRST, then capture reasoning in Memory. TELOS is what future sessions read; Memory is what they might find. Route by decision type: project status changes → TELOS/PROJECTS.md, mission pivots → TELOS/MISSION.md, new strategies → TELOS/STRATEGIES.md.

Bad
: User says "deprioritize Predictive Biomarkers." AI writes a learning file to MEMORY/LEARNING/STRATEGY/ and updates a work session thread. TELOS/PROJECTS.md still shows "Idea Stage." Next session reads TELOS, doesn't know the project was killed.

Correct
: User says "deprioritize Predictive Biomarkers." AI reads TELOS/PROJECTS.md, updates status to "Deprioritized" with rationale, updates MISSION.md if the decision reflects a mission change, adds new strategy to STRATEGIES.md if applicable. THEN writes the reasoning to Memory as a learning signal.

---

*These rules extend `PAI/SYSTEM/AISTEERINGRULES.md`. Both files are loaded and enforced together.*
