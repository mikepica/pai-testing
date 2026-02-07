# Models

## The 70/20/10 Rule of Pharma ML
70% of my time is data wrangling, 20% is modeling, 10% is deployment. Any initiative that doesn't address the 70% is optimizing the wrong thing. The bottleneck is never the algorithm.

## Modality Transfer Gap
Historical data is dominated by small molecules. ADCs, gene therapies, and cell therapies have fundamentally different mechanisms. A model trained on small molecule data will not transfer — separate models per modality is the only honest approach.

## The Explainability-Accuracy Frontier
Explainability and accuracy are both design choices with real engineering tradeoffs. Tree ensembles give exact SHAP. Deep learning gives approximate SHAP with ~3-5% accuracy gain. The right choice depends on who's consuming the prediction, not on what's technically best.
