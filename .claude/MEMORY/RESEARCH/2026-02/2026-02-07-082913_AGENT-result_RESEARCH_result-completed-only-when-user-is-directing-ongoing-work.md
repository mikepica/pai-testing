---
capture_type: RESEARCH
timestamp: 2026-02-07 08:29:13 PST
executor: result
agent_completion: Result completed ` | Only when user is directing ongoing work |
---

# RESEARCH: Result completed ` | Only when user is directing ongoing work |

**Agent:** result
**Completed:** 2026:02:07:082913

---

## Agent Output

Perfect! Now I have a comprehensive understanding. Let me compile this information into a detailed report:

## PAI System Depth Classification & Algorithm Format Implementation - Complete Analysis

Based on my thorough exploration of the PAI system, here's the complete picture of how depth is currently decided and what changes would be needed for a new "simple questions" depth level:

---

### 1. DEPTH CLASSIFICATION SYSTEM (FormatReminder Hook)

**Location:** `/Users/mikepica/Personal_Projects/az-demo/.claude/hooks/FormatReminder.hook.ts`

**Current Depth Levels:**

| Depth | When | Format | Requirements |
|-------|------|--------|--------------|
| **FULL** | Non-trivial work: problem-solving, implementation, design, analysis | 7 phases (OBSERVE→THINK→PLAN→BUILD→EXECUTE→VERIFY→LEARN) with ISC tasks | Default. Use unless ITERATION/MINIMAL clearly fits |
| **ITERATION** | Continuing/adjusting existing work in progress | Condensed: `🔧 CHANGE + ✅ VERIFY + 🗣️ Result` | Only when user is directing ongoing work |
| **MINIMAL** | Pure social with ZERO task content | Header + Summary + Voice | Only: greetings, ratings (1-10), simple acknowledgments |

---

### 2. HOW FORMATREMINDER HOOK CLASSIFIES DEPTH

**Mechanism:** Uses **AI Inference** (Sonnet-tier / standard level) to classify, NOT regex/keyword matching.

**System Prompt Logic** (lines 44-111):

```
CRITICAL RULES:
- Assess EFFORT REQUIRED, not prompt length or keywords
- "analyze everything" is 2 words but FULL depth with analyst capability
- "hey there my friend how are you doing on this fine day" is long but MINIMAL
- "just think about it" contains "just" but if thinking is the task, it's FULL
- When uncertain, ALWAYS choose FULL. False FULL is safe. False MINIMAL loses quality.
- MINIMAL is RARE. Almost everything is FULL or ITERATION.
```

**Classification Function** (lines 125-158):
```typescript
async function classifyPrompt(prompt: string): Promise<{
  depth: 'FULL' | 'ITERATION' | 'MINIMAL';
  capabilities: string[];
  skills: string[];
  thinking: string[];
}>
```

Returns JSON with:
- `depth`: One of FULL/ITERATION/MINIMAL
- `capabilities`: Agent types (research, engineer, architect, analyst, qa)
- `skills`: Specific skill:workflow hints
- `thinking`: Thinking tools (council, redteam, firstprinciples, science, becreative, prompting)

**Inference Tool** (lines 131-137):
- Calls `inference()` from `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/Tools/Inference.ts`
- Level: `standard` (Sonnet model)
- Timeout: 10 seconds
- **Falls back to FULL on failure** (safety default)

---

### 3. MINIMAL MODE CURRENT IMPLEMENTATION

**Output Format** (lines 209-217):
```typescript
case 'MINIMAL':
  return `<system-reminder>
ALGORITHM REQUIRED — DEPTH: MINIMAL
Nothing escapes the Algorithm. Use header format:
🤖 PAI ALGORITHM (v0.2.23) ═════
   Task: [6 words]
📋 SUMMARY: [what was done]
🗣️ ${getDAName()}: [voice line]
</system-reminder>`;
```

**Current Minimal Cases** (per SKILL.md lines 22-26):
- Pure greetings ("hi", "hey")
- Ratings (single number 1-10)
- Simple acknowledgments ("thanks", "cool", "got it")
- **Zero task content required**

**Important:** The Algorithm STILL RUNS at MINIMAL depth — it's not skipped. Only the ISC depth and format are simplified.

---

### 4. CORE SKILL DEFINITION (SKILL.md - Master Source)

**Location:** `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/SKILL.md`

**Key Principle** (line 18):
> "Nothing escapes the Algorithm. The only variable is depth."

**Response Depth Selection Table** (lines 22-26):
```
| Depth | When | Format |
|-------|------|--------|
| **FULL** | Any non-trivial work: problem-solving, implementation, design, analysis, thinking | 7 phases with ISC Tasks |
| **ITERATION** | Continuing/adjusting existing work in progress | Condensed: What changed + Verify |
| **MINIMAL** | Pure social with zero task content: greetings, ratings (1-10), acknowledgments only | Header + Summary + Voice |
```

**Exceptions (lines 423-432):**
```
These inputs don't need deep ISC tracking, but STILL REQUIRE THE OUTPUT FORMAT:
- Ratings (1-10) - Minimal format, acknowledge
- Simple acknowledgments ("ok", "thanks") - Minimal format
- Greetings - Minimal format
- Quick questions - Minimal format

**These are NOT exceptions to using the format. Use minimal format for simple cases.**
```

---

### 5. HOOK CONFIGURATION & SYSTEM INTEGRATION

**Hook Registration** (settings.json lines 178-201):
```json
"UserPromptSubmit": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "/Users/mikepica/.bun/bin/bun /Users/mikepica/Personal_Projects/az-demo/.claude/hooks/FormatReminder.hook.ts"
      },
      // ... other hooks
    ]
  }
]
```

**Hook Execution Order:**
1. FormatReminder (classification)
2. AutoWorkCreation (work tracking)
3. ExplicitRatingCapture
4. ImplicitSentimentCapture
5. UpdateTabTitle

**Output Mechanism:**
- FormatReminder outputs to `stdout` as `<system-reminder>` block
- Output is injected into context before the main response

---

### 6. INFERENCE TOOL DETAILS (For Classification)

**Location:** `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/Tools/Inference.ts`

**Three Tiers:**
```typescript
const LEVEL_CONFIG: Record<InferenceLevel, { model: string; defaultTimeout: number }> = {
  fast: { model: 'haiku', defaultTimeout: 15000 },
  standard: { model: 'sonnet', defaultTimeout: 30000 },
  smart: { model: 'opus', defaultTimeout: 90000 },
};
```

**FormatReminder Uses:** `standard` (Sonnet, 10s timeout)

---

### 7. WHAT WOULD BE NEEDED FOR A "SIMPLE QUESTIONS" DEPTH LEVEL

To add a new depth level for "simple questions" that skips the full 7-phase format, you would need to modify:

**1. FormatReminder.hook.ts:**
- Expand `CLASSIFICATION_SYSTEM_PROMPT` to define new depth level criteria
- Add case for new depth in `classifyPrompt()` return type
- Add switch case in `buildReminder()` with new format output

**2. SKILL.md:**
- Add row to Response Depth Selection table (lines 22-26)
- Document new depth triggers in FULL mode section
- Add example format to MINIMAL/ITERATION sections
- Update "Nothing escapes the Algorithm" explanation

**3. Inference System Prompt (FormatReminder line 44-111):**
```
Example addition:
- SIMPLE: Quick factual answers, single clarifications, no task. Single answer line.
```

**4. Format String Example:**
```typescript
case 'SIMPLE':
  return `<system-reminder>
ALGORITHM REQUIRED — DEPTH: SIMPLE
Simple factual answer required:
🤖 PAI ALGORITHM (v0.2.23)
[Direct answer only]
🗣️ ${getDAName()}: [voice line]
</system-reminder>`;
```

**5. Critical Rule:**
The hook's classification is **AUTHORITATIVE** — agents cannot override it (SKILL.md line 62):
> "The hook's classification is AUTHORITATIVE. Do not override it with your own judgment."

---

### 8. KEY ARCHITECTURAL INSIGHTS

**Non-Bypassing Design:**
- The Algorithm ALWAYS runs (v0.2.22 reframing)
- Depth is the ONLY variable — not whether the Algorithm executes
- Even MINIMAL format includes the `🤖 PAI ALGORITHM` header

**AI-Powered Classification (Not Regex):**
- Uses Claude Sonnet inference on raw prompt
- Assesses EFFORT, not length or keywords
- Safe default on failure: FULL (nothing escapes)

**Two-Pass Capability Selection:**
- **Pass 1 (Hook):** Draft hints from raw prompt only
- **Pass 2 (THINK phase):** Validates against reverse-engineered request + ISC
- Hook hints are starting points, NOT final decisions

**ISC (Ideal State Criteria) Requirements:**
- 8 words exactly
- State, not action ("Tests pass" NOT "Run tests")
- Binary testable (YES/NO in 2 seconds)
- Granular (one concern per criterion)

---

### 9. FILES IN THE SYSTEM

**Core Files:**
- `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/SKILL.md` (master reference)
- `/Users/mikepica/Personal_Projects/az-demo/.claude/hooks/FormatReminder.hook.ts` (classification)
- `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/Tools/Inference.ts` (inference engine)
- `/Users/mikepica/Personal_Projects/az-demo/.claude/settings.json` (hook configuration)
- `/Users/mikepica/Personal_Projects/az-demo/.claude/hooks/README.md` (hook system docs)
- `/Users/mikepica/Personal_Projects/az-demo/.claude/skills/PAI/SYSTEM/AISTEERINGRULES.md` (behavioral rules)

**Hook Files (17 total in /hooks/):**
- FormatReminder.hook.ts (depth classification)
- AutoWorkCreation.hook.ts
- ExplicitRatingCapture.hook.ts
- ImplicitSentimentCapture.hook.ts
- UpdateTabTitle.hook.ts
- ... 12 others

---

### 10. SUMMARY: ADDING "SIMPLE" DEPTH LEVEL

A three-step implementation:

1. **Update FormatReminder.hook.ts:**
   - Add `'SIMPLE'` to classification system prompt
   - Return `SIMPLE` from `classifyPrompt()`
   - Add format case to `buildReminder()`

2. **Update SKILL.md:**
   - Add to Response Depth Selection table
   - Document in "FULL Mode Format" section with simple format example
   - Update Critical Rules about when SIMPLE triggers

3. **Update settings.json (optional):**
   - No change needed (hook already executes on UserPromptSubmit)

The hook's AI inference will automatically learn to classify simple questions once the system prompt is updated.

---

**All paths are absolute per your request.**
agentId: acbcfbc (for resuming to continue this agent's work if needed)
<usage>total_tokens: 54409
tool_uses: 21
duration_ms: 53210</usage>

---

## Metadata

**Transcript:** `/Users/mikepica/.claude/projects/-Users-mikepica-Personal-Projects-az-demo/4b292c03-bdd7-45c9-aab9-6c96024a5b9b.jsonl`
**Captured:** 2026-02-07 08:29:13 PST

---

*This output was automatically captured by UOCS SubagentStop hook.*
