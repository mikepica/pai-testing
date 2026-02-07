# Learning: Clinical Trial Success Predictor Evaluation — 2026-02-07

## Context
Evaluated the idea of using ML to predict clinical trial success probability based on historical AstraZeneca trial data. Used IdeaPipeline:EvaluateIdea workflow with Council (3 perspectives) and FirstPrinciples.

## Insight
The idea scored 3.3/5 overall with a NEEDS INPUT recommendation. The science is real (published models show 0.88 ROC AUC, 21.5% PR-AUC lift), and the ROI potential is enormous (avoiding a single failed Phase III could save $50M-$2B). However, 4 of 7 identified assumptions are unvalidated and ALL relate to data quality and availability — not to the ML approach itself.

## Evidence
- Temporal distribution shift causes "severe performance decay" in clinical prediction models over time (multiple published studies)
- 46% of pharma AI pilots are scrapped before production; only 4 of every 33 prototypes reach production
- Data silos consistently identified as #1 blocker for pharma AI by McKinsey, Bain, and industry reports
- AZ has $13.6B R&D, 191 pipeline projects, AI CoE — organizational capability exists

## Implication
For future pharma ML idea evaluations: **always lead with data access assessment before scoring scientific merit.** The model architecture is rarely the bottleneck; data availability and joinability are. Next step should be GenerateQuestions targeting the data team specifically, not the ML team.
