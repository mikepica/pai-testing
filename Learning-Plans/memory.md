# Hands-On Learning Guide: The Memory System

A step-by-step walkthrough of how PAI captures, stores, and retrieves learnings. You'll trigger each capture path, inspect the output, query past learnings, and understand the full feedback loop.

**Time estimate:** 45-60 minutes for the full walkthrough. Each act is independent.

**Prerequisites:**
- Bun installed (`bun --version`)
- Claude Code CLI available (`claude --version`)
- You're in the `~/Personal_Projects/az-demo/` directory
- You've run through at least Acts 1-2 of `overview.md` (so MEMORY has some data)

---

## How This Guide Is Organized

| Act | What You'll Learn | Time |
|-----|-------------------|------|
| **Act 1** | The directory structure and what lives where | 10 min |
| **Act 2** | How hooks capture data automatically | 10 min |
| **Act 3** | The LEARN phase feedback loop (write path) | 10 min |
| **Act 4** | Querying past learnings (read path) | 10 min |
| **Act 5** | Ratings, sentiment, and failure capture | 10 min |
| **Act 6** | Periodic synthesis and maintenance | 5 min |

---

## Act 1: Orientation — The Memory Directory

Before triggering anything, understand what's already there.

### Step 1.1: See the top-level structure
```bash
ls .claude/MEMORY/
```
You should see these directories:

| Directory | Purpose | What's Inside |
|-----------|---------|---------------|
| `WORK/` | Session-level task tracking | One dir per work session with ISC.json + THREAD.md |
| `LEARNING/` | Derived insights from experience | Categorized learnings (ALGORITHM/, SYSTEM/, SIGNALS/) |
| `RESEARCH/` | Captured agent outputs | Markdown files from spawned subagents |
| `STATE/` | Ephemeral runtime data | current-work.json, caches (can be safely deleted) |

### Step 1.2: Inspect the LEARNING subdirectories
```bash
ls .claude/MEMORY/LEARNING/
```
You should see:

| Subdirectory | What Goes Here | How It Gets Here |
|--------------|----------------|------------------|
| `ALGORITHM/` | Task execution learnings | Algorithm LEARN phase + sentiment detection |
| `SYSTEM/` | Infrastructure/tooling learnings | Hook failures, config errors |
| `SIGNALS/` | User satisfaction ratings (JSONL) | Explicit + implicit rating hooks |
| `SYNTHESIS/` | Pattern analysis reports | `LearningPatternSynthesis.ts` tool |
| `FAILURES/` | Full context dumps for ratings 1-3 | `FailureCapture.ts` tool |

### Step 1.3: Read a learning file
```bash
ls .claude/MEMORY/LEARNING/ALGORITHM/2026-02/
```
Pick any file and read it:
```bash
cat .claude/MEMORY/LEARNING/ALGORITHM/2026-02/<pick-a-file>.md
```

Notice the structure:
- **YAML frontmatter** — `capture_type`, `timestamp`, `source`, `tags`
- **Content sections** — Summary, What Worked, What Failed, Key Insight
- **Source field** — tells you how this learning was captured:
  - `algorithm_learn_phase` = structured output from Algorithm LEARN phase (high quality)
  - `implicit-sentiment` = AI detected user frustration (medium quality)
  - `explicit-rating` = user gave a numeric rating (medium quality)
  - `heuristic` = fallback pattern matching (low quality, often N/A fields)

### Step 1.4: Inspect a WORK session
```bash
ls .claude/MEMORY/WORK/
```
Pick any session directory and explore:
```bash
ls -R .claude/MEMORY/WORK/<pick-a-session>/
cat .claude/MEMORY/WORK/<pick-a-session>/META.yaml
cat .claude/MEMORY/WORK/<pick-a-session>/tasks/*/ISC.json
```

Notice:
- `META.yaml` — session metadata (title, created_at, effort level)
- `tasks/001_*/ISC.json` — tracks success criteria with satisfaction scores
- `tasks/001_*/THREAD.md` — execution log with frontmatter status

### Step 1.5: Check the ratings cache
```bash
cat .claude/MEMORY/LEARNING/SIGNALS/ratings.jsonl
```
Each line is a JSON object with: `timestamp`, `rating` (1-10), `source` (explicit/implicit), `sentiment_summary`, `confidence`.

**Key Takeaway:** MEMORY is organized by *purpose*, not by time. WORK/ tracks sessions. LEARNING/ stores insights. SIGNALS/ caches ratings. STATE/ holds ephemeral runtime data.

---

## Act 2: How Hooks Capture Data Automatically

Every memory write is triggered by a hook. Here's the complete pipeline.

### Step 2.1: See which hooks are configured
```bash
cat .claude/settings.json | grep -A 3 '"hooks"' | head -20
```

Or more specifically, scan for hook files:
```bash
ls .claude/hooks/*.hook.ts
```

### Step 2.2: Understand the hook lifecycle

```
USER SENDS MESSAGE
    │
    ├─► FormatReminder.hook.ts      (classifies depth: FULL/ITERATION/MINIMAL)
    ├─► AutoWorkCreation.hook.ts     (creates WORK/ directory + ISC.json)
    ├─► ExplicitRatingCapture.hook.ts (detects "8 - great work" patterns)
    └─► ImplicitSentimentCapture.hook.ts (AI analyzes emotional tone)

ALGORITHM COMPLETES (Stop event)
    │
    └─► StopOrchestrator.hook.ts
         ├─► ResponseCapture handler   (extracts ISC + LEARN phase → LEARNING/)
         ├─► Voice handler             (sends TTS notification)
         └─► Tab state handler         (updates tab title/color)

SESSION ENDS
    │
    ├─► WorkCompletionLearning.hook.ts (captures work insights → LEARNING/)
    └─► SessionSummary.hook.ts         (marks WORK/ complete, clears STATE/)

SUBAGENT COMPLETES
    │
    └─► AgentOutputCapture.hook.ts    (saves agent output → RESEARCH/)
```

### Step 2.3: Trace a single hook in detail

Read the AutoWorkCreation hook to see how a WORK session is born:
```bash
head -60 .claude/hooks/AutoWorkCreation.hook.ts
```

Notice: it reads the user prompt, classifies it, creates the directory structure, writes `META.yaml` and initial `ISC.json`, and updates `STATE/current-work.json`.

### Step 2.4: Trace the ResponseCapture handler
```bash
head -30 .claude/hooks/handlers/ResponseCapture.ts
```

This is the most important handler for the feedback loop. It:
1. Reads the Algorithm's LEARN phase output via `TranscriptParser.ts`
2. If LEARN phase has structured content → writes a high-quality learning file
3. If no LEARN phase → falls back to heuristic detection
4. Updates ISC.json with satisfaction data from the response

**Key Takeaway:** You never call these manually. They fire automatically at lifecycle events. The quality of captured learnings depends on which path triggered them.

---

## Act 3: The LEARN Phase Feedback Loop (Write Path)

This is the core fix we just built. Let's verify it works end-to-end.

### Step 3.1: Understand the data flow

```
Algorithm FULL response
    │
    ├─► ━━━ LEARN ━━━ 7/7 phase
    │   LEARN_SUMMARY: [what was accomplished]
    │   LEARN_WHAT_WORKED: [what succeeded]
    │   LEARN_WHAT_FAILED: [what was suboptimal]
    │   LEARN_INSIGHT: [reusable principle]
    │   LEARN_CATEGORY: [ALGORITHM or SYSTEM]
    │
    ▼
TranscriptParser.ts → extractLearnPhase()
    │
    ▼
ResponseCapture.ts → generateAlgorithmLearningContent()
    │
    ▼
MEMORY/LEARNING/{category}/YYYY-MM/{timestamp}_LEARNING_{description}.md
```

### Step 3.2: Trigger a FULL Algorithm response

Start Claude and ask something non-trivial:
```bash
claude
```
```
What are the tradeoffs between using a single general ML model vs. specialized models per drug modality?
```

Let the Algorithm run to completion through all 7 phases. Watch for the LEARN phase at the end — it should now have structured `LEARN_SUMMARY`, `LEARN_WHAT_WORKED`, etc. fields.

### Step 3.3: Verify the learning file was created

Exit Claude, then check:
```bash
ls -lt .claude/MEMORY/LEARNING/ALGORITHM/2026-02/ | head -5
```

Read the newest file:
```bash
cat .claude/MEMORY/LEARNING/ALGORITHM/2026-02/$(ls -t .claude/MEMORY/LEARNING/ALGORITHM/2026-02/ | head -1)
```

**What to look for:**
- `source: algorithm_learn_phase` in the frontmatter (not `heuristic`)
- Populated "Summary", "What Worked", "What Failed", "Key Insight" sections (not N/A)
- Tags include `algorithm`

### Step 3.4: Compare with an old N/A file

If you have older learning files, compare:
```bash
# Old format (broken — all N/A):
cat .claude/MEMORY/LEARNING/ALGORITHM/2026-02/2026-02-07-160442_LEARNING_task-completion.md

# New format (populated):
cat .claude/MEMORY/LEARNING/ALGORITHM/2026-02/$(ls -t .claude/MEMORY/LEARNING/ALGORITHM/2026-02/ | head -1)
```

The difference is the feedback loop fix in action.

### Step 3.5: Test the parser directly
```bash
bun .claude/skills/PAI/Tools/TranscriptParser.ts <path-to-a-transcript> --learn
```

This should return JSON with five fields (or `null` for MINIMAL responses). You can find transcript paths at:
```bash
ls ~/.claude/projects/-Users-mikepica-Personal-Projects-az-demo/*.jsonl | tail -3
```

**Key Takeaway:** The LEARN phase now produces structured, parseable output. TranscriptParser extracts it. ResponseCapture writes it as a populated learning file. The N/A problem is solved.

---

## Act 4: Querying Past Learnings (Read Path)

The write path is useless without a read path. `QueryLearnings.ts` closes the loop.

### Step 4.1: See all learnings
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --list
```

This shows every learning file with its category, date, and source type.

### Step 4.2: Get statistics
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --stats
```

Shows: total count, breakdown by category, by month, and by source type.

### Step 4.3: Search by keyword
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts "translation"
bun .claude/skills/PAI/Tools/QueryLearnings.ts "constraint"
```

Text search across all learning file content and filenames.

### Step 4.4: Filter by category
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --category ALGORITHM
bun .claude/skills/PAI/Tools/QueryLearnings.ts --category SYSTEM
```

### Step 4.5: Filter by date
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --since 2026-02-07
bun .claude/skills/PAI/Tools/QueryLearnings.ts --recent 5
```

### Step 4.6: AI-powered search (optional)
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --smart "What have I learned about memory systems?"
```

This uses Haiku to rank results by relevance to your query. Requires Claude CLI.

### Step 4.7: Use verbose mode for full paths
```bash
bun .claude/skills/PAI/Tools/QueryLearnings.ts --list --verbose
```

**Key Takeaway:** The read path is now available. You can query learnings by text, category, date, or AI relevance. This enables the feedback loop — past learnings can inform future work.

---

## Act 5: Ratings, Sentiment, and Failure Capture

The memory system captures user satisfaction through two channels.

### Step 5.1: Give an explicit rating

Start Claude, do some work, then rate:
```bash
claude
```
```
What's 2 + 2?
```
After the response, type:
```
8 - clear and fast
```

Exit, then check:
```bash
tail -1 .claude/MEMORY/LEARNING/SIGNALS/ratings.jsonl
```

You should see a JSON line with `"source": "explicit"`, `"rating": 8`, and your comment.

### Step 5.2: Trigger implicit sentiment detection

Start Claude and express mild frustration:
```bash
claude
```
```
That's not what I asked for at all.
```

Exit, then check:
```bash
tail -1 .claude/MEMORY/LEARNING/SIGNALS/ratings.jsonl
```

You should see `"source": "implicit"` with a lower rating and a sentiment summary.

### Step 5.3: Understand the rating scale

| Rating | Meaning | What Gets Captured |
|--------|---------|-------------------|
| 1-3 | Frustration / failure | Rating + learning file + **full context dump** in FAILURES/ |
| 4-5 | Dissatisfaction / neutral | Rating + learning file |
| 6-7 | Satisfaction | Rating only (in SIGNALS/ratings.jsonl) |
| 8-9 | Impressed | Rating only |
| 10 | Extraordinary | Rating only |

### Step 5.4: Check the FAILURES directory (if any low ratings exist)
```bash
ls .claude/MEMORY/LEARNING/FAILURES/ 2>/dev/null
```

If present, each failure directory contains:
- `CONTEXT.md` — human-readable analysis
- `transcript.jsonl` — full raw conversation
- `sentiment.json` — sentiment details
- `tool-calls.json` — extracted tool invocations

### Step 5.5: Trace the capture code

Read the explicit rating detection:
```bash
head -50 .claude/hooks/ExplicitRatingCapture.hook.ts
```

Notice: it uses regex to match patterns like `8`, `8 - comment`, `8: comment`, and routes low ratings to FailureCapture for full context preservation.

**Key Takeaway:** Ratings flow from two sources (explicit and implicit) into a single SIGNALS/ratings.jsonl cache. Low ratings trigger additional learning captures. Very low ratings (1-3) get full context dumps for root cause analysis.

---

## Act 6: Periodic Synthesis and Maintenance

Two tools run periodically (not automatically) to extract deeper insights.

### Step 6.1: Run pattern synthesis
```bash
bun .claude/skills/PAI/Tools/LearningPatternSynthesis.ts --week --dry-run
```

This reads `ratings.jsonl`, detects frustration/success patterns, and would write a synthesis report to `MEMORY/LEARNING/SYNTHESIS/`. The `--dry-run` flag previews without writing.

Remove `--dry-run` to actually create the report:
```bash
bun .claude/skills/PAI/Tools/LearningPatternSynthesis.ts --week
ls .claude/MEMORY/LEARNING/SYNTHESIS/
```

### Step 6.2: Understand what STATE/ is (and isn't)

```bash
ls .claude/MEMORY/STATE/
```

STATE/ holds **ephemeral** runtime data:
- `current-work.json` — pointer to active work directory (cleared on session end)
- `*-cache.*` — TTL-based caches (weather, location, git, model info)
- `tab-title.json` — current tab display state

**These files can be safely deleted.** The system rebuilds them on demand. Don't confuse STATE/ (ephemeral) with LEARNING/ (permanent).

### Step 6.3: Understand the full data lifecycle

```
1. USER WORKS      → WORK/ session created, tasks tracked, ISC scored
2. ALGORITHM RUNS  → LEARN phase produces structured insights
3. HOOKS CAPTURE   → Learning files written to LEARNING/{category}/
4. USER RATES      → SIGNALS/ratings.jsonl updated (explicit or implicit)
5. LOW RATINGS     → FAILURES/ full context dump for root cause
6. SYNTHESIS RUNS  → Pattern reports in SYNTHESIS/ identify recurring issues
7. QUERY TOOL      → QueryLearnings.ts enables searching past learnings
8. SESSION ENDS    → WORK/ marked complete, STATE/ cleaned up
```

---

## Testing Checklist

Use this to verify the memory system is working correctly:

| Test | Command | Expected Result |
|------|---------|-----------------|
| LEARN phase extraction | `bun TranscriptParser.ts <transcript> --learn` | JSON with 5 fields (or null for MINIMAL) |
| Learning file quality | `cat MEMORY/LEARNING/ALGORITHM/2026-02/<newest>.md` | Populated sections (not N/A) |
| QueryLearnings works | `bun QueryLearnings.ts --stats` | Non-zero total count |
| Explicit rating capture | Rate "8 - test" then check ratings.jsonl | New line with source: "explicit" |
| Implicit sentiment | Express frustration then check ratings.jsonl | New line with source: "implicit" |
| WORK session created | Start Claude, send a prompt, check `MEMORY/WORK/` | New session directory exists |
| ISC updated | After Algorithm completes, check task's ISC.json | `satisfaction` field populated |
| State cleanup | Exit Claude, check STATE/ | `current-work.json` should be cleared |

---

## Key Files Reference

| File | Role | Read/Write |
|------|------|------------|
| `skills/PAI/Tools/TranscriptParser.ts` | Parses LEARN phase from transcripts | Read |
| `skills/PAI/Tools/QueryLearnings.ts` | Query past learnings | Read |
| `skills/PAI/Tools/LearningPatternSynthesis.ts` | Aggregate ratings into patterns | Read + Write |
| `hooks/handlers/ResponseCapture.ts` | Captures learnings from Algorithm output | Write |
| `hooks/ExplicitRatingCapture.hook.ts` | Detects explicit ratings (e.g., "8 - great") | Write |
| `hooks/ImplicitSentimentCapture.hook.ts` | AI sentiment detection | Write |
| `hooks/AutoWorkCreation.hook.ts` | Creates WORK/ session directories | Write |
| `hooks/lib/learning-utils.ts` | Shared categorization logic | Library |
| `hooks/lib/paths.ts` | PAI_DIR resolution (expandPath) | Library |
| `skills/PAI/Components/Algorithm/v0.2.25.md` | LEARN phase format spec | Spec |
| `MEMORY/LEARNING/README.md` | Canonical learning file format | Docs |

---

## Troubleshooting

**Learning files have all N/A fields:** The Algorithm's LEARN phase isn't producing structured `LEARN_` fields. Check that `v0.2.25.md` is the active Algorithm version and contains the `LEARN_SUMMARY`, `LEARN_WHAT_WORKED`, etc. fields in the LEARN phase template.

**QueryLearnings shows 0 results:** Check that `PAI_DIR` in `settings.json` is an absolute path (not `$HOME/...`). Shell variables aren't expanded by Claude Code.

**No ratings in SIGNALS/:** Implicit sentiment capture requires the Inference tool (Haiku). Check that `claude --version` works and the subscription is active. Explicit ratings require the pattern "number" or "number - comment".

**WORK/ directory not created:** The `AutoWorkCreation.hook.ts` must be listed in `settings.json` under `hooks.UserPromptSubmit`. Verify with: `grep -A5 'UserPromptSubmit' .claude/settings.json`

**STATE/ files accumulate:** This is normal. They're caches. Safe to delete: `rm .claude/MEMORY/STATE/*-cache.*`

**Stale `$HOME/` directory appears in project root:** A hook is using `process.env.PAI_DIR` without expansion. Ensure `settings.json` uses an absolute path for `PAI_DIR`, not `$HOME/...` or `~/...`.
