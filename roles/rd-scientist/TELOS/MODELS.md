# Models

## Signal vs. Noise Is Context-Dependent
A ±5% variation in an assay result is noise to a statistician but signal to me. It tells me about cell viability, reagent batch effects, or environmental conditions. Any AI that flattens this loses information.

## The Validation Ladder
Trust in a prediction requires climbing a ladder: retrospective on historical data → prospective on held-out compounds → blinded head-to-head against my assay → only then do I reduce wet lab validation. You can't skip rungs.

## The 2019 Protocol Boundary
Our measurement standards changed in 2019. Data before and after that boundary are not directly comparable. Anyone using our historical data must account for this or their model is trained on inconsistent labels.
