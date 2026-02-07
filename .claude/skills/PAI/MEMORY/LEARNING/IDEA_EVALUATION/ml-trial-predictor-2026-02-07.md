# Learning: ML Clinical Trial Success Predictor Evaluation — 2026-02-07

## Context — What idea was evaluated
Using ML to predict clinical trial success probability based on historical AstraZeneca trial data. Evaluated via Council Quick (3 domain perspectives) + FirstPrinciples (28 assumptions deconstructed).

## Insight — What the evaluation revealed
The naive framing ("predict trial success with ML") does not survive first-principles scrutiny. 4 of 28 assumptions are broken: non-stationarity of the drug development landscape, innovation penalty from historical models, phase conflation, and the fundamental question of whether historical patterns are the right lens for resource allocation. The strongest version is three focused intelligence tools (base rate dashboard, failure mode taxonomy, trial design similarity engine) rather than one ambitious predictor. Organizational adoption — not technical feasibility — is the primary risk.

## Evidence — Key constraint or finding that drove the assessment
Assumption #5 (historical data is representative of future trials) is BROKEN at the Hard classification level. The modality landscape shifts faster than models can learn. A model trained on small-molecule cardiovascular trials from 2010 tells you nothing about an ADC in solid tumors in 2027. This single finding reframes the entire approach from prediction to intelligence augmentation.

## Implication — How this changes future evaluation approach
For pharma AI ideas, always run FirstPrinciples on the non-stationarity assumption first. If the domain shifts faster than models can retrain, prediction framing is wrong and retrieval/monitoring/calibration framing is right. Also: organizational adoption risk should be scored as a first-class criterion, not a footnote — it was the highest-impact risk dimension here and nearly every Council perspective flagged it.
