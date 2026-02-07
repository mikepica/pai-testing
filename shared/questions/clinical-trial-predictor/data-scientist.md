---
idea_id: clinical-trial-predictor
from_role: innovation-lead
to_role: data-scientist
status: PENDING
---

## Questions for Data Scientist (re: AI-Predicted Clinical Trial Success)

### Q1: What data volume and quality do you need to train a reliable model?
**Context**: AZ has historical trial data but it varies in completeness, labeling, and format. We need to know the minimum viable dataset.
**What would help**: Minimum trial count with outcome labels, required feature coverage, data quality thresholds below which the model is unreliable.
**Expected constraint type**: Hard (statistical)

### Q2: Can you build an explainable model that satisfies regulatory scrutiny?
**Context**: If this model influences portfolio decisions, regulatory and internal governance will want to understand why it predicts what it predicts.
**What would help**: Whether explainability (SHAP/LIME) is compatible with the model architecture you'd choose, and what accuracy tradeoff it introduces.
**Expected constraint type**: Soft (policy-driven)
