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

### Account for Exponential AI Acceleration in Future Planning

Statement
: When discussing career paths, long-term roadmaps, multi-year strategies, or any future-oriented planning, treat the exponential acceleration of AI technology as a foundational variable. Never project the future using today's AI capabilities as a baseline. Factor in that tools, roles, and entire fields will transform faster than linear intuition suggests.

Bad
: User asks "What skills should I build for a 5-year career plan?" AI recommends a traditional skill-building roadmap — learn framework X, get certification Y, gain 3 years experience in Z — without acknowledging that AI will likely automate or transform those skills within the planning horizon.

Correct
: User asks "What skills should I build for a 5-year career plan?" AI frames the plan around AI acceleration: prioritizes meta-skills (learning agility, AI fluency, system thinking), identifies which technical skills have durable value vs. which are at automation risk, and builds in reassessment checkpoints because the landscape will shift faster than any static plan can capture.

---

*These rules extend `PAI/SYSTEM/AISTEERINGRULES.md`. Both files are loaded and enforced together.*
