---
idea_id: clinical-trial-predictor
from_role: data-scientist
to_role: innovation-lead
constraint_summary:
  hard: 1
  soft: 2
  assumption: 2
---

## Data Scientist Response: AI-Predicted Clinical Trial Success

### Q1: What data volume and quality do you need to train a reliable model?

**Constraint Classification:**
| Constraint | Type | Detail |
|------------|------|--------|
| Minimum 500 completed trials with binary outcome labels | HARD | Below this, any supervised model will overfit regardless of architecture or regularization |
| Explainability for regulatory submission (SHAP/LIME) | SOFT | Regulatory hasn't formally required it for internal portfolio tools yet, but internal governance policy expects it. Could be waived for non-patient-facing predictions |
| Real-time inference (<2 sec per prediction) | SOFT | Current use case is quarterly portfolio review — batch processing is fine. Real-time only matters if embedded in clinical workflow later |
| Historical trial data is representative of future trials | ASSUMPTION | Drug modalities are shifting rapidly (small molecule → ADCs → gene therapy). Models trained on historical small molecule data may not transfer. No one has validated this for AZ's specific portfolio mix |
| Feature engineering from unstructured protocols is feasible | ASSUMPTION | Protocol PDFs vary wildly in structure across therapeutic areas and geographies. Our NLP extraction pipeline has not been tested on clinical protocols — only on lab notebooks |

**FirstPrinciples Analysis:**
- *Deconstructed*: "Reliable model" = sufficient data + appropriate architecture + validated on held-out set + explainable to stakeholders who will act on predictions
- *Challenged*: The assumption that we need a single general model. A family of modality-specific models (small molecule, biologic, ADC) may each need less data and perform better. Also: "reliable" depends on the decision being made — portfolio screening can tolerate lower precision than patient-level prediction.
- *Reconstructed*: Start with small molecule trials only (largest dataset, ~800 completed at AZ). Build modality-specific models. Defer ADC/gene therapy modeling until 2027 when dataset is sufficient. Accept lower precision for portfolio screening vs. clinical decision support.

### Q2: Can you build an explainable model that satisfies regulatory scrutiny?

**Constraint Classification:**
| Constraint | Type | Detail |
|------------|------|--------|
| SHAP values computable for tree-based models | HARD | Mathematical guarantee — SHAP is exact for tree ensembles, approximate for deep learning |
| Deep learning models sacrifice ~3-5% accuracy for SHAP approximation | SOFT | Exact tradeoff depends on architecture. Could mitigate with hybrid approach (DL for prediction, separate interpretable model for explanation) |

**FirstPrinciples Analysis:**
- *Deconstructed*: "Explainable" = stakeholder can understand why a specific prediction was made + can identify which features drove it + can challenge the reasoning
- *Challenged*: "Regulatory scrutiny" assumes external regulatory review. For an internal portfolio tool, the scrutiny is from the governance committee, not the FDA. The bar is lower.
- *Reconstructed*: Use gradient-boosted trees (XGBoost) as the primary architecture — exact SHAP, competitive accuracy, fast training. Keep deep learning as an experimental benchmark. Present feature importance at the cohort level (which trial characteristics predict success) rather than individual prediction level.
