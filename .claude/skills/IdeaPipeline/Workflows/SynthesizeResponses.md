# SynthesizeResponses Workflow

## Trigger
User asks to synthesize team responses, combine answers, or "what did the team say."

## Algorithm Integration
Runs through The Algorithm at THOROUGH effort. Cross-domain conflict detection requires careful analysis.

## Process
1. Read all response files from `$SHARED_DIR/responses/{idea-id}/`
2. For each response, extract the constraint classification table (Hard/Soft/Assumption)
3. Cross-reference constraints across roles:
   - **Identify conflicts**: Where one role's HARD constraint conflicts with another role's HARD constraint (e.g., "Phase III endpoints only" vs "500+ trials minimum")
   - **Surface challenged assumptions**: Where one role's ASSUMPTION overlaps with another's (both untested, both affect the same data/decision)
   - **Find agreements**: Where roles independently confirm the same constraint
4. Produce synthesis brief with:
   - Constraint summary table (all constraints, all roles, classified)
   - Conflicts identified and their implications
   - Assumptions that need validation before proceeding
   - Updated recommendation: PROCEED / PROCEED WITH CONSTRAINTS / NEEDS MORE INPUT / REJECT
5. Update ISC rows from original evaluation (BLOCKED → DONE or ADJUSTED based on team input)

## LEARN Phase
Write to `MEMORY/LEARNING/IDEA_EVALUATION/`:
- What constraint patterns emerged across roles
- Which conflicts were predictable vs. surprising
- What to cross-reference earlier in future evaluations
