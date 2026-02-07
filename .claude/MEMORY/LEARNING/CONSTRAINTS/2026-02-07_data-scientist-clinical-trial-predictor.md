# Learning: Data Scientist Constraints — Clinical Trial Predictor — 2026-02-07

## Context
Responded as Data Scientist to 3 questions from Innovation Lead about data accessibility, pre-trial features, and labeled outcome sufficiency for an ML clinical trial success predictor at AZ.

## Constraint Patterns
- **Data access is Soft, not Hard.** The Innovation Lead framed data silos as the #1 blocker, but FirstPrinciples decomposition shows ALL data access constraints are Soft (organizational, resolvable with effort). The true Hard constraints are in the biology (class imbalance, oncology difficulty, runtime features being unavailable pre-trial).
- **Assumptions cluster around label quality.** 3 of 4 Assumptions relate to whether clean, structured data can be extracted from messy pharma sources (ambiguous trial outcomes, CSR PDFs, unstratified counts). This is the validation frontier.
- **Counter-questions were more valuable than answers.** Each question contained assumptions that, when challenged, reframed the problem productively: initiate governance NOW, scope to target-level features, use transfer learning architecture.

## Implication
For future constraint articulation in pharma ML: **separate the organizational (Soft) from the biological (Hard) constraints early.** Soft constraints feel blocking but are solvable with sponsorship. Hard constraints (class imbalance, domain uncertainty) are the real ceiling and should drive architecture decisions from day 1.
