---
capture_type: RESEARCH
timestamp: 2026-02-07 09:27:09 PST
executor: agentname
agent_completion: Agentname completed ) and legacy format (🎯 COMPLETED)
---

# RESEARCH: Agentname completed ) and legacy format (🎯 COMPLETED)

**Agent:** agentname
**Completed:** 2026:02:07:092709

---

## Agent Output

Perfect! Now I have comprehensive information. Let me compile a detailed report for the user.

## Complete PAI Memory System Analysis

I've conducted a thorough exploration of the PAI memory system. Here's your comprehensive guide:

---

## 1. MEMORY Directory Structure

The `/Users/mikepica/Personal_Projects/az-demo/.claude/MEMORY/` directory is organized into 6 main areas:

**WORK/** - Primary work tracking (directories per session)
- Structure: `WORK/{timestamp}_{session-title}/`
- Contains: `META.yaml` (metadata), `ISC.json` (success criteria), `tasks/`, `scratch/`, `agents/`, `research/`, `verification/`

**LEARNING/** - Derived insights from experience
- `SYSTEM/` - Infrastructure/tooling learnings (YYYY-MM subdirs)
- `ALGORITHM/` - Task execution learnings (YYYY-MM subdirs)
- `FAILURES/` - Full context dumps for low ratings 1-3
- `SIGNALS/ratings.jsonl` - All user satisfaction ratings (fast cache for statusline)
- `SYNTHESIS/` - Weekly/monthly pattern analysis reports

**RESEARCH/** - Agent output captures
- Format: `YYYY-MM/YYYY-MM-DD-HHMMSS_AGENT-{type}_{description}.md`
- Captures from SubagentStop hook (spawned agents like researchers, architects, engineers)

**STATE/** - Fast runtime data (ephemeral, rebuilt on demand)
- `current-work.json` - Active work directory pointer
- `algorithm-state.json` - Algorithm execution phase
- `format-streak.json`, `algorithm-streak.json` - Performance metrics
- `trending-cache.json` - TTL-based cached analysis
- `progress/` - Multi-session project tracking
- `integrity/` - System health check results

**SECURITY/** - Security audit trail
- `security-events.jsonl` - All security decisions and blocks

**PAISYSTEMUPDATES/** - Architecture change history
- Manual entries tracking all system changes over time

---

## 2. Hooks That Write to MEMORY

The `settings.json` configuration at `/Users/mikepica/Personal_Projects/az-demo/.claude/settings.json` defines the complete hook pipeline (PAI_DIR: `/Users/mikepica/Personal_Projects/az-demo/.claude`):

### **UserPromptSubmit** hooks (fire on each user message):

**a) FormatReminder.hook.ts**
- Writes: Format validation reminders
- Trigger: Every user prompt submission

**b) AutoWorkCreation.hook.ts** (CRITICAL for MEMORY)
- Writes to: `MEMORY/WORK/{timestamp}_{session-title}/` + `MEMORY/STATE/current-work.json`
- Creates: Work directory, task subdirs, `tasks/00X_{task-slug}/ISC.json`, `THREAD.md`
- Trigger: UserPromptSubmit (session creation)
- Logic: Classifies prompt (work/question/conversational), estimates effort level, creates work hierarchy

**c) ExplicitRatingCapture.hook.ts** (CRITICAL for SIGNALS)
- Writes to: `MEMORY/LEARNING/SIGNALS/ratings.jsonl` (appends rating entries)
- Also writes: `MEMORY/LEARNING/{category}/YYYY-MM/*.md` (for ratings <6)
- Trigger: UserPromptSubmit (detects explicit "8 - great work" format)
- Pattern detection: Matches "number" or "number - comment" or "number: comment"
- Calls: `FailureCapture.ts` for ratings 1-3 to create full context dumps

**d) ImplicitSentimentCapture.hook.ts** (CRITICAL for SIGNALS)
- Writes to: `MEMORY/LEARNING/SIGNALS/ratings.jsonl` (appends with source: "implicit")
- Also writes: `MEMORY/LEARNING/{category}/YYYY-MM/*.md` (for low ratings)
- Trigger: UserPromptSubmit (analyzes emotional tone using Haiku inference)
- Logic: Skips if explicit rating detected (defers to ExplicitRatingCapture), runs fast sentiment analysis
- Rating scale: 1-2 (frustration), 3-4 (mild dissatisfaction), 5 (neutral), 6-7 (satisfaction), 8-9 (impressed), 10 (extraordinary)
- Calls: `FailureCapture.ts` for ratings 1-3 to create full context dumps

**e) UpdateTabTitle.hook.ts**
- Writes: Tab title updates (tab state tracking)

### **Stop** hooks (fire when algorithm execution completes):

**StopOrchestrator.hook.ts**
- Orchestrates stop handlers including ResponseCapture

### **ResponseCapture Handler** (in `/Users/mikepica/Personal_Projects/az-demo/.claude/hooks/handlers/ResponseCapture.ts`):
- Writes to: `MEMORY/WORK/{session_dir}/tasks/{task}/ISC.json` (updates task criteria satisfaction)
- Also writes: `MEMORY/WORK/{session_dir}/tasks/{task}/THREAD.md` (updates frontmatter status)
- Also writes: `MEMORY/LEARNING/{category}/YYYY-MM/*.md` (learning files if applicable)
- Trigger: Stop hook (response completion)
- Logic:
  - Extracts ISC (Ideal State Criteria) from algorithm response
  - Parses structured sections: ✅ CRITERIA, ❌ ANTI-CRITERIA, 📊 ISC Satisfaction
  - Extracts LEARN phase content (summary, what worked, what failed, key insight)
  - Captures as learning file if source is "algorithm_learn_phase" (high quality)

### **SessionEnd** hooks (fire at session termination):

**a) WorkCompletionLearning.hook.ts**
- Writes to: `MEMORY/LEARNING/{category}/YYYY-MM/{timestamp}_work_*.md`
- Trigger: SessionEnd
- Logic: Captures work metadata (files changed, tools used, ISC criteria) when significant work completed
- Criteria for capture: Files were modified OR multiple items in work dir OR work was manually created

**b) SessionSummary.hook.ts**
- Writes to: `MEMORY/WORK/{work_dir}/META.yaml` (updates status to COMPLETED, adds completed_at timestamp)
- Deletes: `MEMORY/STATE/current-work.json` (clears session state)
- Trigger: SessionEnd (final cleanup)

### **SubagentStop** hooks (fire when spawned agents complete):

**AgentOutputCapture.hook.ts** (CRITICAL for RESEARCH)
- Writes to: `MEMORY/RESEARCH/YYYY-MM/AGENT-{type}_*.md`
- Also sends: Observability events and push notifications
- Trigger: SubagentStop (Task tool invocation completion)
- Logic: Extracts agent type and completion message, persists agent output for future reference
- Formats: Supports both new format (🗣️ AgentName) and legacy format (🎯 COMPLETED)

### **PreToolUse** hooks (security/validation):

**SecurityValidator.hook.ts**
- Writes to: `MEMORY/SECURITY/security-events.jsonl`
- Trigger: Any tool use (Bash, Edit, Write, Read)

---

## 3. Tools That Read from MEMORY

Located at `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/Tools/`:

**a) QueryLearnings.ts**
- Reads from: `MEMORY/LEARNING/SYSTEM/` and `MEMORY/LEARNING/ALGORITHM/` (all .md files)
- Purpose: Query past learnings with filters (category, date range, search)
- Commands:
  - `bun QueryLearnings.ts <query>` - Text search
  - `bun QueryLearnings.ts --category ALGORITHM` - Filter by category
  - `bun QueryLearnings.ts --recent 5` - Last N learnings
  - `bun QueryLearnings.ts --since 2026-01-01` - Date filter
  - `bun QueryLearnings.ts --smart <query>` - AI-powered ranking
  - `bun QueryLearnings.ts --stats` - Statistics summary

**b) TranscriptParser.ts**
- Reads from: `~/.claude/projects/-Users-{username}--claude/*.jsonl` (Claude Code native transcripts)
- Purpose: Extract structured content from session transcripts
- Parses:
  - Last assistant message
  - Voice completion (with prosody)
  - Plain completion (for tab titles)
  - Structured sections (date, summary, analysis, actions, results, status, next)
  - LEARN phase content (summary, whatWorked, whatFailed, insight, category)
  - Response state (awaitingInput, completed, error)
- Used by: ResponseCapture, ExplicitRatingCapture, ImplicitSentimentCapture, other hooks

**c) SessionHarvester.ts**
- Reads from: `~/.claude/projects/-Users-{username}--claude/` (raw session transcripts)
- Writes to: `MEMORY/LEARNING/{category}/YYYY-MM/*.md`
- Purpose: Periodic extraction of learnings from complete session transcripts
- Commands:
  - `--recent N` - Harvest from N most recent sessions (default: 10)
  - `--all` - Harvest from all sessions in last 7 days
  - `--session ID` - Harvest specific session
  - `--dry-run` - Show without writing
- Pattern detection: Looks for corrections, errors, and insights in conversation

**d) LearningPatternSynthesis.ts**
- Reads from: `MEMORY/LEARNING/SIGNALS/ratings.jsonl`
- Writes to: `MEMORY/LEARNING/SYNTHESIS/YYYY-MM/weekly-patterns.md`
- Purpose: Aggregate ratings into actionable pattern reports
- Commands:
  - `--week` - Analyze last 7 days (default)
  - `--month` - Analyze last 30 days
  - `--all` - Analyze all ratings
  - `--dry-run` - Show without writing
- Pattern detection: Identifies frustration patterns (time/performance, incomplete work, wrong approach, over-engineering, tool failures, communication problems, repetitive issues) and success patterns (quick resolution, good understanding, proactive help, clean implementation)

**e) FailureCapture.ts**
- Reads from: `~/.claude/projects/` (raw session transcripts)
- Writes to: `MEMORY/LEARNING/FAILURES/YYYY-MM/{timestamp}_{8-word-description}/`
- Creates per-failure:
  - `CONTEXT.md` - Human-readable analysis with metadata
  - `transcript.jsonl` - Full raw conversation
  - `sentiment.json` - Sentiment analysis details
  - `tool-calls.json` - Extracted tool invocations
- Purpose: Full context preservation for low ratings (1-3)
- Called by: ExplicitRatingCapture and ImplicitSentimentCapture when rating < 4

**f) Inference.ts**
- Fast AI inference tool used by ImplicitSentimentCapture for sentiment analysis
- Uses Haiku model for speed

---

## 4. Complete Feedback Loop: How Data Flows

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER REQUEST                                                        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Claude Code NATIVE STORAGE (30-day retention)                       │
│ ~/.claude/projects/-Users-{username}--claude/{uuid}.jsonl           │
│ (COMPLETE TRANSCRIPT: every message, tool call, response)           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
    ┌───────────────────┐  ┌──────────────────────┐
    │ ON PROMPT SUBMIT  │  │ ON RESPONSE (STOP)   │
    │ (UserPromptSubmit)│  │                      │
    └────────┬──────────┘  └──────────┬───────────┘
             │                        │
    ┌────────┴─────────┐     ┌────────┴──────────────┐
    │                  │     │                       │
    ▼                  ▼     ▼                       ▼
[Auto Work]    [Rating Capture]  [Response Capture]  [Learning]
Creation       (Explicit +        (ISC Extraction    (from Learn
(WORK/,        Implicit)          + LEARN phase)     phase)
STATE/)        (SIGNALS/ +
               LEARNING/)
                    │
                    │ (if rating 1-3)
                    ▼
            ┌──────────────────┐
            │ Failure Capture  │
            │ (full context)   │
            │ (FAILURES/)      │
            └──────────────────┘

                           │
                           ▼
                ┌───────────────────────────┐
                │ ON SESSION END            │
                │ (SessionEnd)              │
                └─────────┬─────────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
  [Work Completion]                [Session Summary]
  Learning Capture              (mark COMPLETED,
  (LEARNING/)                   clear STATE/)


        ▼ PERIODIC HARVESTING (not automatic, run manually)

┌──────────────────────────────────────────────┐
│ SessionHarvester.ts                          │
│ Reads: ~/.claude/projects/                   │
│ Extracts: Corrections, errors, insights      │
│ Writes: MEMORY/LEARNING/{category}/          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ LearningPatternSynthesis.ts                  │
│ Reads: LEARNING/SIGNALS/ratings.jsonl        │
│ Analyzes: Frustration & success patterns     │
│ Writes: LEARNING/SYNTHESIS/                  │
└──────────────────────────────────────────────┘
```

**Key insight:** Claude Code's native `projects/` is the source of truth (firehose). Hooks capture domain-specific events directly into specialized directories (WORK/, LEARNING/SIGNALS/, RESEARCH/, FAILURES/, SECURITY/). No intermediate layer - direct capture.

---

## 5. Memory System Documentation

### Primary Source:
**File:** `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/SYSTEM/MEMORYSYSTEM.md`

This document provides:
- Architecture overview
- Detailed directory specifications
- Hook integration table
- Harvesting tool descriptions
- Data flow diagrams
- Quick reference commands

### Learning File Format

**Canonical structure (standard markdown + YAML frontmatter):**

```yaml
---
capture_type: LEARNING
timestamp: 2026-02-07 16:02:50 PST
rating: 5
source: implicit-sentiment | explicit-rating | algorithm_learn_phase | heuristic | task-completion
auto_captured: true
tags: [auto-capture, algorithm, implicit-rating]
---

# Descriptive Title

**Date:** YYYY-MM-DD
**Rating:** X/10 (if applicable)
**Detection Method:** Sentiment Analysis / Algorithm LEARN Phase / Manual Rating
**Summary:** One-line summary

---

## Detailed Analysis

[Detailed explanation of what was learned]

---

## What Worked

[Approach/decision that succeeded and why]

---

## What Failed

[What was suboptimal, or "Nothing"]

---

## Key Insight

[Reusable principle for future work]
```

**Three learning categories:**
- **ALGORITHM** - Task execution and approach improvements
- **SYSTEM** - Infrastructure and tooling improvements
- **FAILURES** - Full context dumps for ratings 1-3 (separate from learnings)

**Quality tiers:**
- `algorithm_learn_phase` (HIGH) - Structured fields from Algorithm FULL response
- `explicit_rating` (MEDIUM) - User provided explicit rating with comment
- `implicit_sentiment` (MEDIUM) - Detected frustration from natural language
- `task-completion` (MEDIUM) - Session-end work completion
- `heuristic` (LOW) - Fallback heuristic detection

---

## 6. Settings That Affect Memory

**File:** `/Users/mikepica/Personal_Projects/az-demo/.claude/settings.json`

**Critical memory-related settings:**

```json
{
  "env": {
    "PAI_DIR": "/Users/mikepica/Personal_Projects/az-demo/.claude",
    "PROJECTS_DIR": "",
    "TIME_ZONE": "America/Los_Angeles" (implied, used in timestamp generation)
  },
  
  "hooks": {
    "UserPromptSubmit": [
      "FormatReminder.hook.ts",
      "AutoWorkCreation.hook.ts",
      "ExplicitRatingCapture.hook.ts",
      "ImplicitSentimentCapture.hook.ts",
      "UpdateTabTitle.hook.ts"
    ],
    "Stop": [
      "StopOrchestrator.hook.ts" (orchestrates ResponseCapture)
    ],
    "SessionEnd": [
      "WorkCompletionLearning.hook.ts",
      "SessionSummary.hook.ts"
    ],
    "SubagentStop": [
      "AgentOutputCapture.hook.ts"
    ],
    "PreToolUse": [
      "SecurityValidator.hook.ts"
    ]
  }
}
```

**Version info:**
- `paiVersion: 2.5`
- Memory system version: 7.1 (Full Context Failure Analysis)

---

## 7. ISC.json - Ideal State Criteria Tracking

**Auto-captured by ResponseCapture handler**, not manually written.

**Structure:**
```json
{
  "taskId": "001_task-slug",
  "status": "COMPLETE" | "PARTIAL" | "IN_PROGRESS",
  "effortLevel": "QUICK" | "STANDARD" | "THOROUGH" | "TRIVIAL",
  "criteria": ["Criterion 1", "Criterion 2"],
  "antiCriteria": ["Anti-criterion 1"],
  "satisfaction": {
    "satisfied": 3,
    "partial": 1,
    "failed": 0,
    "total": 4
  },
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

**Extraction source:** Algorithm output patterns:
- `✅ CRITERIA:` blocks → Initial criteria
- `❌ ANTI-CRITERIA:` blocks → Initial anti-criteria
- `📊 ISC Satisfaction:` blocks → Final verification results

**Capture depth by effort tier:**
- QUICK/TRIVIAL: Final satisfaction summary only
- STANDARD: Initial criteria + final satisfaction
- THOROUGH: Full version history with every phase update

---

## 8. Ratings JSONL Format

**File:** `/Users/mikepica/Personal_Projects/az-demo/.claude/MEMORY/LEARNING/SIGNALS/ratings.jsonl`

**Line format (one JSON object per line):**

```json
{
  "timestamp": "2026-02-07T16:02:50+00:00",
  "rating": 5,
  "session_id": "uuid",
  "source": "explicit" | "implicit",
  "sentiment_summary": "Reflective question, no sentiment toward PAI",
  "confidence": 0.95,
  "comment": "Optional user comment (explicit ratings only)"
}
```

**Fields:**
- `timestamp` - ISO 8601 timestamp
- `rating` - 1-10 integer
- `session_id` - Claude Code session UUID
- `source` - "explicit" (user provided) or "implicit" (AI-detected)
- `sentiment_summary` - Brief description of detected/provided sentiment
- `confidence` - Confidence score (0-1) for implicit ratings
- `comment` - Optional user comment from explicit ratings

---

## 9. Complete Hooks Overview Table

| Hook Name | Trigger | Writes To | Purpose |
|-----------|---------|-----------|---------|
| FormatReminder.hook.ts | UserPromptSubmit | (no memory writes) | Format validation |
| AutoWorkCreation.hook.ts | UserPromptSubmit | WORK/, STATE/ | Create work directory + task tracking |
| ExplicitRatingCapture.hook.ts | UserPromptSubmit | LEARNING/SIGNALS/, LEARNING/, FAILURES/ | Capture explicit user ratings |
| ImplicitSentimentCapture.hook.ts | UserPromptSubmit | LEARNING/SIGNALS/, LEARNING/, FAILURES/ | Detect emotional sentiment |
| UpdateTabTitle.hook.ts | UserPromptSubmit | STATE/ | Update tab state |
| StopOrchestrator.hook.ts | Stop | (via handlers) | Orchestrate response handling |
| ResponseCapture handler | Stop | WORK/, LEARNING/ | Extract ISC + LEARN phase |
| WorkCompletionLearning.hook.ts | SessionEnd | LEARNING/ | Capture work completion insights |
| SessionSummary.hook.ts | SessionEnd | WORK/, STATE/ | Mark work complete, clear state |
| AgentOutputCapture.hook.ts | SubagentStop | RESEARCH/ | Archive agent outputs |
| SecurityValidator.hook.ts | PreToolUse | SECURITY/ | Audit security decisions |

---

## 10. Sample Learning File (Real Example)

From `/Users/mikepica/Personal_Projects/az-demo/.claude/MEMORY/LEARNING/ALGORITHM/2026-02/2026-02-07-160250_LEARNING_sentiment-rating-5.md`:

```yaml
---
capture_type: LEARNING
timestamp: 2026-02-07 16:02:50 PST
rating: 5
source: implicit-sentiment
auto_captured: true
tags: [sentiment-detected, implicit-rating, improvement-opportunity]
---

# Implicit Low Rating Detected: 5/10

**Date:** 2026-02-07
**Rating:** 5/10
**Detection Method:** Sentiment Analysis
**Sentiment Summary:** Reflective question, no sentiment toward PAI

---

## Detailed Analysis (for Learning System)

User is asking a self-reflective question about their own challenges and 
motivations—not requesting PAI to do something specific or reacting to PAI's work. 
This is a neutral inquiry seeking insight or discussion. No emotional sentiment 
toward PAI is present; User is simply initiating a conversation topic.

---

## Assistant Response Context

No response context available

---

## Improvement Notes

This response triggered a 5/10 implicit rating based on detected user sentiment.

**Quick Summary:** Reflective question, no sentiment toward PAI

**Root Cause Analysis:** Review the detailed analysis above to understand what 
went wrong and how to prevent similar issues.

**Action Items:**
- Review the assistant response context to identify specific failure points
- Consider whether this represents a pattern that needs systemic correction
- Update relevant skills, workflows, or constitutional principles if needed
```

---

## 11. Work Directory Structure (Real Example)

```
MEMORY/WORK/
├── 20260207-162536_why-in-personalprojectspai-folder/
│   ├── META.yaml                    # Session metadata
│   ├── tasks/
│   │   └── 001_why-in-personalprojectspai-folder/
│   │       ├── ISC.json             # Task criteria satisfaction
│   │       └── THREAD.md            # Task execution log
│   └── scratch/                     # Temporary files
└── 20260207-164619_tell-me-about-my-mission/
    ├── META.yaml
    └── tasks/
        ├── 001_tell-me-about-my-mission/
        ├── 002_why-full-7-step-process-for-simple-quest/
        └── 003_explain-formatreminder-hook-and-debug-is/
```

---

## Key Takeaways for Your Learning Guide

1. **Two-layer architecture**: Claude Code's native `projects/` (firehose) + MEMORY/ (organized domains)
2. **Hooks are event-driven**: Every major lifecycle event (UserPromptSubmit, Stop, SessionEnd, SubagentStop) captures to specialized directories
3. **Feedback loop is complete**: Ratings → Learnings → QueryLearnings tool enables continuous improvement
4. **Failure context matters**: Low ratings (1-3) get full context dumps in FAILURES/ for root cause analysis
5. **Periodic harvesting**: SessionHarvester and LearningPatternSynthesis extract deeper insights from raw transcripts
6. **State is ephemeral**: current-work.json and caches can be deleted safely - system recovers
7. **ISC tracking is automatic**: ResponseCapture extracts success criteria from algorithm responses
8. **Multi-source ratings**: Both explicit (user "8 - great") and implicit (detected sentiment) populate SIGNALS/ratings.jsonl

This system creates a self-improving loop: work → capture → rate → learn → query learnings → improve → work better.
agentId: aeb8a0b (for resuming to continue this agent's work if needed)
<usage>total_tokens: 70439
tool_uses: 33
duration_ms: 92014</usage>

---

## Metadata

**Transcript:** `/Users/mikepica/.claude/projects/-Users-mikepica-Personal-Projects-az-demo/ebef7d98-bee5-4a8f-b35f-1a3d211806b9.jsonl`
**Captured:** 2026-02-07 09:27:09 PST

---

*This output was automatically captured by UOCS SubagentStop hook.*
