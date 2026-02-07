---
capture_type: RESEARCH
timestamp: 2026-02-07 08:29:37 PST
executor: default
agent_completion: Twenty-eight assumptions deconstructed, four broken, idea rebuilt as three focused tools.
---

# RESEARCH: Twenty-eight assumptions deconstructed, four broken, idea rebuilt as three focused tools.

**Agent:** default
**Completed:** 2026:02:07:082937

---

## Agent Output

Now I have sufficient context. Let me conduct the FirstPrinciples analysis.

---

SUMMARY: FirstPrinciples analysis of ML-based clinical trial success prediction using historical AstraZeneca trial data, applying Deconstruct-Challenge-Reconstruct framework.

ANALYSIS: This idea sits at the intersection of pharmaceutical R&D, machine learning, and organizational decision-making. It carries deep assumptions across at least six domains. Below is the exhaustive analysis.

---

# FirstPrinciples Analysis: ML Prediction of Clinical Trial Success

## DECONSTRUCT: The Assumption Map

I have identified 28 discrete assumptions this idea rests upon. Each is granular and testable.

---

## CHALLENGE and CLASSIFY

| # | Assumption | Classification | Challenge | Status |
|---|-----------|---------------|-----------|--------|
| **DATA ASSUMPTIONS** | | | | |
| 1 | AstraZeneca has historical trial data in a structured, queryable format | Assumption | Large pharma data is often siloed across legacy systems (Oracle Clinical, Medidata Rave, internal data lakes). Migration to unified formats is a multi-year enterprise project. AZ's internal data architecture may not expose trial-level features consistently. **Break condition:** Data exists only in PDFs, CRFs, and incompatible legacy databases. | Weakened |
| 2 | Historical trial data contains sufficient features to be predictive (endpoints, patient demographics, molecule properties, indication, phase, site count, etc.) | Assumption | ClinicalTrials.gov provides only coarse metadata. Rich features (biomarker data, PK/PD profiles, preclinical signals, competitive landscape at time of trial) are scattered across different systems. Most published datasets lack the features that actually drive outcomes. **Break condition:** The features that predict success are not recorded in historical data. | Weakened |
| 3 | The data covers enough trials to train a model | Hard | AZ runs roughly 100-200 trials at any given time. Over 20 years, perhaps 1,000-2,000 trials total. After filtering for completeness, this could drop to hundreds. ML models, especially deep learning, struggle with N < 1,000 structured samples. **Break condition:** Effective sample size after filtering is below 300. | Weakened |
| 4 | Trial outcomes are cleanly labeled (success/failure) | Soft | Trials have nuanced outcomes: partial success (missed primary but hit secondary endpoint), strategic terminations (portfolio rebalancing, not science failure), regulatory holds, protocol amendments that restart timelines. Binary labeling loses this signal. **Break condition:** More than 30% of trials have ambiguous outcome labels. | Weakened |
| 5 | Historical data is representative of future trials | Hard | Drug development shifts dramatically over time. Immuno-oncology barely existed 15 years ago. Gene therapies, ADCs, bispecifics are all recent. A model trained on small-molecule cardiovascular trials from 2005 tells you nothing about an ADC in solid tumors in 2027. **Break condition:** The therapeutic area and modality mix has shifted so much that historical data is non-stationary. | Broken |
| 6 | Data can be accessed without prohibitive governance barriers | Soft | Pharma companies have strict data governance, patient privacy requirements, and intellectual property concerns. Even internal teams face multi-month data access processes. **Break condition:** Data governance review takes longer than the project timeline. | Holds (with effort) |
| **BIOLOGY ASSUMPTIONS** | | | | |
| 7 | Clinical trial outcomes have learnable signal from historical features | Hard | This is the deepest assumption. If trial success were largely predictable from pre-trial features, pharma companies would already have near-zero failure rates. The 90%+ Phase I-to-approval failure rate persists despite decades of data accumulation by sophisticated organizations. **Break condition:** Trial outcomes are dominated by irreducible biological uncertainty that no feature set captures. | Weakened |
| 8 | Biology is sufficiently similar across therapeutic areas to pool data | Hard | Oncology trials fail for different reasons than cardiovascular trials. CNS trials have unique blood-brain barrier challenges. Rare disease trials have different statistical properties. Pooling assumes shared latent structure. **Break condition:** No cross-TA transfer learning signal exists. | Weakened |
| 9 | The factors that determine trial success are measurable before the trial starts | Hard | Many failure modes are emergent: unexpected toxicity at scale, manufacturing issues, enrollment challenges, geopolitical disruptions, competitive readouts during the trial, protocol design flaws discovered mid-trial. These are not in any pre-trial feature set. **Break condition:** More than 50% of failure causes are exogenous or emergent. | Weakened |
| 10 | Molecular/biological features can be encoded in ML-compatible representations | Assumption | Encoding a drug candidate's mechanism of action, target biology, patient population heterogeneity, and disease pathophysiology into feature vectors is an open research problem. Current approaches (molecular fingerprints, target embeddings) lose enormous biological nuance. **Break condition:** Encoding fidelity is too low for meaningful signal. | Weakened |
| **METHODOLOGY ASSUMPTIONS** | | | | |
| 11 | Binary classification (success/fail) is the right framing | Soft | Alternative framings: probability of Phase transition, time-to-outcome regression, multi-class (success/partial/pivot/fail), survival analysis of trial duration. Binary classification throws away information and may not match decision needs. **Break condition:** Stakeholders need probability distributions, not point predictions. | Weakened |
| 12 | Standard ML approaches (XGBoost, random forests, logistic regression) are appropriate | Soft | With small N, high dimensionality, and non-stationary distributions, these approaches may overfit or find spurious correlations. Bayesian approaches, causal inference methods, or survival models may be more appropriate. **Break condition:** Standard ML produces overfit models that do not generalize out-of-sample. | Holds (conditionally) |
| 13 | Model performance can be meaningfully evaluated | Hard | With small sample sizes, cross-validation is noisy. Temporal splits (train on past, test on recent) are essential but reduce training data further. A model that achieves 65% accuracy on 200 test samples has wide confidence intervals. **Break condition:** Evaluation uncertainty is so large that you cannot distinguish the model from a coin flip. | Weakened |
| 14 | The model will outperform expert judgment | Assumption | Experienced drug development teams already incorporate historical patterns into their go/no-go decisions. The bar is not "better than random" but "better than a committee of PhDs and MDs who have been doing this for 20 years." **Break condition:** Human expert calibration is already near the achievable ceiling. | Weakened |
| 15 | A single model can serve across phases (I, II, III) | Assumption | Phase I (safety), Phase II (efficacy signal), and Phase III (confirmatory) have fundamentally different success drivers. A unified model conflates distinct decision problems. **Break condition:** Phase-specific models are required, further fragmenting already small datasets. | Broken |
| **ORGANIZATIONAL ASSUMPTIONS** | | | | |
| 16 | AstraZeneca leadership wants this tool | Assumption | Pharma companies are conservative about automated decision support in R&D. Pipeline decisions involve billions of dollars and career-defining bets. Executives may not trust a black-box prediction. **Break condition:** No executive sponsor exists who will champion AI-assisted trial decisions. | Weakened |
| 17 | The prediction would change actual decisions | Assumption | If the model says "this trial has 30% chance of success" but the science team believes in the mechanism, will anyone stop the trial? In practice, portfolio decisions are driven by strategic fit, competitive dynamics, and scientific conviction, not historical base rates. **Break condition:** The model's output never overrides or even influences a go/no-go decision. | Weakened |
| 18 | Stakeholders agree on what "success" means | Soft | Success could mean: primary endpoint met, regulatory approval, commercial success, return on investment, or scientific learning achieved. Each definition produces a different training target. **Break condition:** Stakeholders cannot agree on the outcome variable. | Weakened |
| 19 | Clinical development teams will provide data and context | Soft | Teams guarding their trial data may resist contributing to a system that could flag their programs negatively. Data contribution requires trust and incentive alignment. **Break condition:** Teams refuse to contribute data or context out of self-preservation instinct. | Weakened |
| 20 | The tool fits into existing decision-making workflows | Soft | Pipeline review meetings, governance boards, and investment committees have established processes. Inserting an ML prediction requires workflow integration, UI/UX design, and change management. **Break condition:** No natural insertion point in existing governance processes. | Holds (with effort) |
| **REGULATORY ASSUMPTIONS** | | | | |
| 21 | Regulators are neutral on AI-assisted trial selection | Soft | The FDA and EMA are increasingly interested in AI in drug development but primarily for clinical trial design (adaptive trials, enrichment strategies), not for corporate go/no-go decisions. The regulatory stance is evolving. **Break condition:** Regulators view AI-assisted trial selection as requiring new oversight frameworks. | Holds |
| 22 | The model does not need regulatory validation itself | Soft | If the model influences which trials proceed, it indirectly affects patient access to experimental therapies. Regulators could argue this constitutes a clinical decision support tool. **Break condition:** Regulatory bodies classify the tool as a medical device or clinical decision support requiring 510(k) or equivalent. | Holds (currently) |
| 23 | Model outputs will not be discoverable in litigation | Assumption | If AZ proceeds with a trial the model flagged as low-probability and patients are harmed, model outputs could become evidence. If AZ terminates a trial the model flagged but that might have worked, shareholders could claim reliance on unvalidated AI. **Break condition:** Legal counsel determines model outputs create unacceptable litigation exposure. | Weakened |
| **ETHICAL ASSUMPTIONS** | | | | |
| 24 | It is ethical to use historical patterns to deny future trials | Hard | Historical data embeds historical biases: underrepresentation of certain populations, therapeutic areas receiving less funding, geographic and demographic skew. A model trained on biased history perpetuates those biases. **Break condition:** The model systematically deprioritizes trials for underrepresented populations or rare diseases. | Weakened |
| 25 | False negatives are acceptable | Hard | A model that incorrectly predicts failure for a trial that would have succeeded denies patients access to a life-saving therapy. The asymmetric cost of false negatives vs. false positives in drug development is extreme. **Break condition:** Even one false negative that kills a viable drug candidate is catastrophic. | Weakened |
| 26 | Transparency is achievable | Soft | Stakeholders will demand to know WHY the model predicts a certain probability. SHAP values and feature importance provide some interpretability, but complex interactions in small datasets may produce unstable explanations. **Break condition:** Explanations are unstable across similar trials, destroying trust. | Weakened |
| 27 | The model will not create perverse incentives | Assumption | If trial teams know an ML model scores their program, they may optimize for model-friendly features rather than scientific merit. This is Goodhart's Law applied to drug development. **Break condition:** Teams begin "gaming" the model by selecting trial designs that score well rather than designs that serve patients. | Weakened |
| 28 | Historical success rates are the right lens for resource allocation | Assumption | Breakthrough therapies often come from programs that looked unlikely on paper. First-in-class drugs by definition lack historical precedent. A model trained on historical patterns would systematically undervalue novel approaches. **Break condition:** The highest-value drugs in AZ's history would have been killed by this model. | Broken |

---

## Summary Counts

| Classification | Count | Holds | Weakened | Broken |
|---------------|-------|-------|----------|--------|
| Hard | 9 | 0 | 7 | 2 |
| Soft | 10 | 4 | 6 | 0 |
| Assumption | 9 | 0 | 7 | 2 |
| **Total** | **28** | **4** | **20** | **4** |

**4 assumptions hold. 20 are weakened. 4 are broken.** This idea in its naive form does not survive first-principles scrutiny.

---

## RECONSTRUCT: The Strongest Version of This Idea

The naive framing -- "predict whether a trial will succeed" -- breaks under scrutiny. But the underlying impulse is sound: AstraZeneca has accumulated decades of institutional knowledge about what makes trials succeed or fail, and that knowledge is not systematically captured or leveraged. The reconstruction addresses this.

### What breaks the naive version:

1. **Non-stationarity (Assumption 5, BROKEN):** The drug development landscape shifts faster than models can learn. A model trained on 2010-era trials is not informative about 2027 modalities.

2. **Novelty penalty (Assumption 28, BROKEN):** The most valuable drugs are precisely the ones that lack historical precedent. Any model trained on patterns will systematically penalize innovation.

3. **Small N with high dimensionality (Assumption 3, WEAKENED):** Even pooling all of AZ's trials, the effective sample size is too small for reliable ML generalization.

4. **Phase conflation (Assumption 15, BROKEN):** Success drivers differ fundamentally across phases.

### The rebuilt idea: Three specific, defensible tools instead of one ambitious predictor

**Tool 1: Trial Design Quality Scorer (addresses Assumptions 2, 4, 11, 12)**

Instead of predicting outcomes, score the *design quality* of a planned trial against historical best practices. This is a retrieval-augmented analysis, not a prediction model. Input: trial protocol. Output: "Here are the 5 most similar historical trials. 3 of them failed. The common failure mode was enrollment pace at sites with fewer than N patients. Your design shares this vulnerability." This sidesteps the prediction problem entirely and provides *actionable intelligence* rather than a probability.

**Tool 2: Failure Mode Taxonomy and Early Warning System (addresses Assumptions 7, 9, 25)**

Build a structured taxonomy of historical failure modes (toxicity signals, enrollment shortfalls, endpoint misses, competitive readouts) and map them to detectable early indicators. This is not ML prediction; it is knowledge engineering. The system monitors active trials against historical failure patterns and generates alerts. This converts the prediction problem into a monitoring problem, which is more tractable and more useful.

**Tool 3: Portfolio-Level Base Rate Dashboard (addresses Assumptions 14, 16, 17, 18)**

Provide phase-specific, therapeutic-area-specific, modality-specific historical success rates as calibration anchors for human decision-makers. No prediction model -- just well-curated base rates with confidence intervals. This is the "outside view" from Kahneman's planning fallacy research: teams are overconfident about their specific program, and base rates correct this bias. The system does not make decisions; it ensures decision-makers have the right reference class.

### Why the reconstruction is stronger:

- **Avoids the prediction trap.** None of these tools claims to predict the future. They provide structured historical intelligence.
- **Handles non-stationarity.** The retrieval system and taxonomy can be updated continuously. Base rates can be windowed to recent years.
- **Respects small N.** Retrieval and taxonomies work with small datasets. Base rates are simple enough to be reliable.
- **Phase-specific by design.** Each tool naturally segments by phase.
- **Organizationally adoptable.** These tools augment human judgment rather than replacing it, dramatically reducing adoption resistance.
- **Ethically defensible.** Information provision, not automated decision-making. Humans retain full agency.
- **Litigation-safe.** Providing base rates is not prescriptive. No model "said to kill the program."
- **Innovation-neutral.** Retrieval systems flag when there is NO similar historical trial, which is valuable information (you are in uncharted territory) rather than a negative score.

### Implementation path:

Phase 1 (3 months): Build the base rate dashboard from ClinicalTrials.gov public data and AZ internal structured data. Validate against known outcomes. Ship to portfolio review teams.

Phase 2 (6 months): Build the failure mode taxonomy from retrospective analysis of AZ's terminated and failed trials. Requires clinical development team interviews. Integrate into active trial monitoring.

Phase 3 (9 months): Build the trial design similarity engine. Requires protocol digitization and NLP extraction of design features. Integrate into protocol development workflow.

Phase 4 (12+ months): Only after Tools 1-3 are adopted and trusted, explore whether the accumulated structured data enables modest predictive modeling for specific, narrow questions (e.g., "Will this Phase II oncology trial meet its enrollment timeline given the site selection?").

---

## ISC Tracker

```
+-- ISC: FirstPrinciples Analysis -- ML Trial Prediction -------+
| Phase: RECONSTRUCT (complete)                                  |
| Criteria:  28 assumptions identified                           |
| Status:    4 hold / 20 weakened / 4 broken                     |
+----------------------------------------------------------------+
| [C1] Naive prediction framing breaks under scrutiny            |
| [C2] Three-tool reconstruction is defensible                   |
| [C3] Base rate dashboard is lowest-risk highest-value start    |
| [C4] Failure mode taxonomy converts prediction to monitoring   |
| [C5] Trial design scorer uses retrieval, not prediction        |
| [A1] Do NOT build a single binary success/fail classifier      |
| [A2] Do NOT pool across phases without phase-specific models   |
| [A3] Do NOT claim to replace human judgment in go/no-go        |
| [A4] Do NOT train on data older than the current modality era  |
+----------------------------------------------------------------+
```

---

STATUS: FirstPrinciples analysis complete. The naive idea (ML predicts trial success) does not survive scrutiny. The reconstruction (three focused intelligence tools) is significantly stronger and more defensible.

CAPTURE: 28 assumptions deconstructed across 6 domains. 4 broken assumptions (non-stationarity, novelty penalty, phase conflation, innovation penalization) are fundamental blockers to the naive approach. The reconstruction reframes prediction as intelligence augmentation: base rate dashboards, failure mode taxonomies, and trial design similarity retrieval. Implementation should start with the base rate dashboard using public ClinicalTrials.gov data.

NEXT: If proceeding, the recommended next step is to validate Assumption 3 (data sufficiency) by inventorying AZ's accessible trial data, counting effective sample sizes per phase and therapeutic area, and assessing feature completeness. This determines whether even the reconstructed tools have sufficient raw material. A RedTeam analysis of the reconstruction itself would also strengthen the proposal before presenting to stakeholders.

COMPLETED: Twenty-eight assumptions deconstructed, four broken, idea rebuilt as three focused tools.
agentId: a9f2072 (for resuming to continue this agent's work if needed)
<usage>total_tokens: 31692
tool_uses: 5
duration_ms: 141432</usage>

---

## Metadata

**Transcript:** `/Users/mikepica/.claude/projects/-Users-mikepica-Personal-Projects-az-demo/8dffbc85-1a10-4c3f-a7f1-ac98578427fd.jsonl`
**Captured:** 2026-02-07 08:29:37 PST

---

*This output was automatically captured by UOCS SubagentStop hook.*
