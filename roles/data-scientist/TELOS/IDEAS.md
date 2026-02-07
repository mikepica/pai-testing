# Ideas

## I1: Automated Data Quality Scoring
A pre-modeling tool that scores any dataset on completeness, consistency, label quality, and temporal stability. If the score is below threshold, don't model — fix the data first.

## I2: Federated Feature Engineering
Instead of centralizing all lab data, let each lab run feature engineering locally and share only the engineered features. Solves data governance issues and reduces transfer volume.

## I3: Model Monitoring as a Shared Service
Build one drift detection and monitoring dashboard that any deployed model can plug into. Stop building bespoke monitoring for each model.
