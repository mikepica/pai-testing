---
capture_type: LEARNING
timestamp: 2026-02-08 13:28:18 UTC
auto_captured: true
tags: [auto-capture]
---

# Quick Learning: Task Completion

**Date:** 2026-02-08
**Auto-captured:** Yes

---

## Summary

N/A

## Analysis

N/A

## Actions Taken

N/A

## Results

N/A

## Current Status

N/A

## Next Steps

N/A

---

<details>
<summary>Full Response</summary>

━━━ 🧠 THINK ━━━ 2/7

🔍 **THINKING TOOLS ASSESSMENT** (justify exclusion):
│ Council:          EXCLUDE — single clear answer to deliver, no tradeoffs to debate
│ RedTeam:          EXCLUDE — explaining tools, not making a claim to stress-test
│ FirstPrinciples:  EXCLUDE — tools are already well-defined, no hidden assumptions
│ Science:          EXCLUDE — not iterative/experimental
│ BeCreative:       EXCLUDE — explanation benefits from clarity, not divergence

🔍 **SKILL CHECK** (validate hook hints against ISC):
│ Hook suggested:   Algorithm agent
│ ISC requires:     Clear explanation of PAI internals — no agent spawning needed
│ Final skills:     None — direct explanation from loaded CORE context

🎯 **CAPABILITY SELECTION:**
│ Skills:     None needed
│ Thinking:   None included (educational explanation)
│ Primary:    Direct response — CORE context already loaded with full tool definitions
│ Pattern:    Specialist
│ Sequence:   Direct explanation
│ Rationale:  All 5 tools are fully defined in the loaded CORE; no external research or agent delegation needed

━━━ 📋 PLAN ━━━ 3/7

Walk through each tool with: **what it is → how it works mechanically → when it fires → the example from their table**. Then explain the overarching justify-exclusion principle and how tools layer on top of capability agents.

━━━ 🔨 BUILD + ⚡ EXECUTE ━━━ 4-5/7

Here's how each thinking tool works in PAI:

---

## The 5 Thinking Tools

These are **meta-cognitive layers** — they don't replace the capability agents (Engineer, Architect, etc.) but shape *how the Algorithm thinks* before those agents execute.

### 1. Council — Multi-Agent Debate
**What it does:** Spawns 3-7 agents with distinct perspectives who debate the problem. Each agent argues for a different approach, they challenge each other, and a synthesis emerges.

**When to INCLUDE:** Multiple valid paths exist and you need to weigh tradeoffs — not just pick the obvious one.

**Your table's reasoning:** Three viable career paths (Innovation Lead vs. Solutions Architect vs. AI PM) with no clear winner. Council debates the tradeoffs between them rather than me arbitrarily picking one.

---

### 2. FirstPrinciples — Deconstruct → Challenge → Reconstruct
**What it does:** Takes a problem apart to its fundamental truths. Three steps:
1. **Deconstruct** — Break the concept into its atomic components
2. **Challenge** — Question every assumption ("Why does it have to be this way?")
3. **Reconstruct** — Build back up from only the validated foundations

**When to INCLUDE:** The problem might be a symptom of something deeper, or rests on unexamined assumptions.

**Your table's reasoning:** "Enterprise AI adoption catalyst" is a compound concept. FirstPrinciples decomposes what that *actually requires* at its root — rather than accepting the label at face value.

---

### 3. RedTeam — Adversarial Stress-Testing (32 Agents)
**What it does:** Spawns up to 32 adversarial agents who try to *break* a proposal. They find holes, attack assumptions, identify failure modes, and surface risks the builder didn't see.

**When to INCLUDE:** You have a plan, claim, or design that needs stress-testing before committing.

**Your table's reasoning:** EXCLUDED because you're still *building* the plan — there's nothing concrete to attack yet. RedTeam is for *after* you have a proposal to defend.

---

### 4. Science — Hypothesis → Test → Analyze Cycles
**What it does:** Frames the problem as a scientific experiment. You form a hypothesis, design a test, run it, analyze results, and iterate. Multiple cycles until you converge on truth.

**When to INCLUDE:** The answer requires experimentation — debugging, performance optimization, A/B testing, or situations where you genuinely don't know the outcome until you try.

**Your table's reasoning:** EXCLUDED because career path analysis isn't iterative/experimental. You're not running tests — you're reasoning about options.

---

### 5. BeCreative — Extended Thinking + 5 Diverse Options
**What it does:** Activates extended/deep thinking mode and forces generation of 5 meaningfully different options. Prevents anchoring on the first idea and explores the full solution space.

**When to INCLUDE:** You need creative divergence — novel approaches, avoiding the obvious, or when the problem space is wide open.

**Your table's reasoning:** EXCLUDED because once a role is chosen (via Council), the requirements become clear. No need for creative divergence at that point.

---

## The Justify-Exclusion Principle

The key design principle: **tools are opt-OUT, not opt-IN.**

For every FULL-depth request, the Algorithm *must evaluate all 5 tools* and provide a reason for excluding each one. The burden of proof is on *not* using them.

This inverts the natural default. Without this rule, the Algorithm would gravitate toward familiar patterns (just use Engineer, skip everything else). The justify-exclusion principle forces genuine consideration of whether multi-perspective debate, root-cause analysis, or adversarial testing would improve the output.

**Invalid exclusion reasons:**
- "Too simple" — simple tasks can have hidden assumptions (FirstPrinciples)
- "Already know the answer" — confidence without verification is the failure mode (RedTeam)
- "Would take too long" — latency doesn't justify skipping quality

---

## How Tools Layer with Capabilities

```
Thinking Tools (meta-cognitive)     ← Council, FirstPrinciples, etc.
        ↓ shape
Capability Agents (execution)       ← Engineer, Architect, QA, etc.
        ↓ produce
Artifacts (output)                  ← Code, designs, plans, etc.
        ↓ verified against
ISC Criteria (success measures)     ← TaskCreate/TaskUpdate
```

Thinking tools run in the **THINK phase** and influence which capabilities get selected and how they execute. They're the "how should we think about this?" layer before the "who does the work?" layer.

---

━━━ ✅ VERIFY ━━━ 6/7

</details>
