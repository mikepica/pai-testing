---
idea_id: clinical-trial-predictor
from_role: innovation-lead
to_role: rd-scientist
status: PENDING
---

## Questions for R&D Scientist (re: AI-Predicted Clinical Trial Success)

### Q1: What endpoint data do you trust enough for ML training?
**Context**: The model needs historical trial outcome data mapped to binary success/failure. Not all endpoints are equally reliable or standardized across trials.
**What would help**: A list of endpoints you'd trust as ground truth for training labels vs. ones that are too noisy or inconsistent.
**Expected constraint type**: Hard (biology-driven)

### Q2: What's the minimum validation you'd need before trusting a prediction?
**Context**: If the model says "85% chance this compound succeeds in Phase II," what would convince you to act on it — change your experimental plan, deprioritize a manual screen?
**What would help**: Your validation threshold — retrospective validation on held-out data? A prospective pilot on 5 compounds? Published external benchmark?
**Expected constraint type**: Soft (trust/process-driven)
