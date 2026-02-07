# SurfaceBlockers Workflow

## Trigger
User asks to surface blockers, identify constraints, or "what could go wrong" for a given topic.

## Algorithm Integration
Runs through The Algorithm at STANDARD effort, using FirstPrinciples.

## Process
1. Load TELOS for domain context
2. Use FirstPrinciples to deconstruct the topic
3. For each fundamental component, identify potential constraints
4. Classify all constraints as Hard/Soft/Assumption
5. Prioritize by impact on the topic

## Output
Structured constraint list with classification and priority.

## LEARN Phase
Write to `MEMORY/LEARNING/CONSTRAINTS/`.
