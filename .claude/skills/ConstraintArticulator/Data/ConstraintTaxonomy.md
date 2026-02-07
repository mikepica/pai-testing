# Constraint Taxonomy

## Classification Guide

### Hard Constraints
Cannot be engineered around. Changing them requires changing reality, law, or biology.
- **Physics/Biology**: Laws of nature, biological variability, assay timelines
- **Regulation**: FDA requirements, GDPR, ICH guidelines, GxP
- **Mathematics**: Statistical power requirements, minimum sample sizes

**Test**: "Could this constraint be removed by a VP's decision?" If no → HARD.

### Soft Constraints
Can be changed with effort, agreement, or organizational will.
- **Policy**: Internal standards, preferred tools, budget allocations
- **Process**: Current workflows, team capacity, sprint cycles
- **Preference**: "We usually do it this way," historical convention

**Test**: "Could this constraint be removed by a VP's decision?" If yes → SOFT.

### Assumptions
Untested beliefs treated as constraints. May be true or false — needs validation.
- **Data assumptions**: "The data is representative," "the labels are accurate"
- **Technical assumptions**: "This approach will scale," "extraction accuracy is sufficient"
- **Domain assumptions**: "Results will transfer across modalities"

**Test**: "Has anyone actually verified this?" If no → ASSUMPTION.
