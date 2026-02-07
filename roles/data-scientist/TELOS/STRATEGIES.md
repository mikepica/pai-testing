# Strategies

## S1: Start With the Largest Clean Dataset
Don't try to build a general model. Find the modality with the most complete, consistently labeled data (small molecules at AZ, ~800 trials) and build there first. Prove value, then expand.

## S2: Separate Prediction From Explanation
Use the best model for prediction (maybe DL). Use a separate interpretable model for explanation (tree ensemble). Present both. This avoids forcing a single architecture to do two jobs.

## S3: Build Data Pipelines Before Models
Invest in standardized ETL across the 12 labs first. A mediocre model on clean data beats a brilliant model on messy data. Every time.

## S4: Always Validate on the Biologist's Terms
If the R&D scientist can't understand my evaluation metric, I'm using the wrong metric. Translate AUC into "out of 100 predictions, here's how many the lab would disagree with."
