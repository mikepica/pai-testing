# LEARNING - Derived Insights

**Purpose:** Knowledge artifacts extracted from experience. What we learned, not what happened.

---

## Structure

| Directory | Purpose | Format |
|-----------|---------|--------|
| `SYSTEM/` | Infrastructure/tooling learnings | Markdown by month |
| `ALGORITHM/` | Task execution learnings | Markdown by month |
| `SIGNALS/` | User satisfaction ratings | JSONL (cache for statusline) |

---

## SYSTEM/ vs ALGORITHM/

| Category | When Used | Examples |
|----------|-----------|----------|
| **SYSTEM/** | Tooling/infrastructure failures | Hook crashed, config error, deploy failed |
| **ALGORITHM/** | Task execution issues | Wrong approach, over-engineered, missed the point |

---

## SIGNALS/

**Not a learning - a cache.** Contains `ratings.jsonl`, a queryable index of rating events from RAW for fast statusline display. See `SIGNALS/README.md` for details.

---

## What Populates This

- `ResponseCapture.hook.ts` - Algorithm LEARN phase (primary) or heuristic fallback
- `ExplicitRatingCapture.hook.ts` - Low ratings (<6)
- `ImplicitSentimentCapture.hook.ts` - Detected frustration

---

## Canonical Learning File Format

Learning files follow a standard structure with YAML frontmatter and four content sections.

### Frontmatter

```yaml
---
capture_type: LEARNING
timestamp: 2026-02-07 16:04:42 UTC
auto_captured: true
source: algorithm_learn_phase    # or "heuristic", "explicit_rating", "implicit_sentiment"
tags: [auto-capture, algorithm]
---
```

### Content Sections

| Section | Description | Example |
|---------|-------------|---------|
| **Summary** | What the task accomplished (1-2 sentences) | "Fixed the broken feedback loop in the PAI memory system" |
| **What Worked** | Approach/decision that succeeded and why | "Using Algorithm phase markers instead of emoji patterns for extraction" |
| **What Failed** | What was suboptimal or "Nothing" | "Initial regex was too greedy and matched across phases" |
| **Key Insight** | Reusable principle for future work | "Always scope regex extraction to a known section boundary first" |

### Source Types and Quality

| Source | Quality | Description |
|--------|---------|-------------|
| `algorithm_learn_phase` | **High** | Structured fields from Algorithm FULL response LEARN phase |
| `heuristic` | **Low** | Fallback: heuristic-detected learning moment, often produces N/A fields |
| `explicit_rating` | **Medium** | User gave explicit rating with comment |
| `implicit_sentiment` | **Medium** | Detected frustration in user message |

### Querying Learnings

Use `QueryLearnings.ts` to search and filter past learnings:

```
bun QueryLearnings.ts <query>               # Text search
bun QueryLearnings.ts --category ALGORITHM   # Filter by category
bun QueryLearnings.ts --recent 5             # Last N learnings
bun QueryLearnings.ts --since 2026-01-01     # Date filter
bun QueryLearnings.ts --smart <query>        # AI-powered ranking
bun QueryLearnings.ts --list                 # List all
bun QueryLearnings.ts --stats                # Statistics
```

---

## Key Principle

**Learnings are derived insights, not raw events.** They answer "what did we learn?" not "what happened?" Raw events go to RAW/. Learnings are extracted when there's actionable knowledge.
