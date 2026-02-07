# SyncProfile Workflow

## Trigger
User asks to sync profile from recent work, auto-update profile, or process profile suggestions.

## Algorithm Integration
This workflow runs THROUGH The Algorithm at FULL effort. Do not skip phases.

## OBSERVE Phase — ISC Creation
⚠️ CREATE ISC TASKS NOW using TaskCreate. Do NOT use manual tables.

Create these ISC criteria (8 words, state-not-action, binary testable):

1. "Profile suggestion file found and successfully parsed" — Source: EXPLICIT
2. "Each detected change presented to user for approval" — Source: EXPLICIT
3. "Approved changes applied to correct TELOS profile files" — Source: INFERRED
4. "Suggestion file cleared after processing all items" — Source: IMPLICIT

🎯 ISC Tasks:
[INVOKE TaskList — this is the source of truth, NO manual tables]

## THINK Phase — Thinking Tools Assessment
Run justify-exclusion for all thinking tools:
- **Council**: EXCLUDE — Single clear approach (read suggestions → confirm → apply)
- **FirstPrinciples**: EXCLUDE — Straightforward data sync, no assumptions to challenge
- **RedTeam**: EXCLUDE — User confirms each change, no claims to stress-test
- **BeCreative**: EXCLUDE — Structured sync, no divergence needed
- **Science**: EXCLUDE — Not experimental
- **Prompting**: EXCLUDE — Not a meta-prompting task

## EXECUTE Phase

### Step 1: Read Suggestion File
Check for `$SHARED_DIR/profile-suggestions/{role-name}.md`.
If no file exists, inform user that no auto-detected changes are pending and suggest running ReviewProfile instead.

### Step 2: Parse Suggestions
Each suggestion in the file follows the format:
```
## [Date] — [Signal Type]
- **File:** [TELOS file to update]
- **Field:** [Specific field/row]
- **Suggested Change:** [What to add or update]
- **Evidence:** [What triggered this suggestion]
```

### Step 3: Present for Approval
Use AskUserQuestion to present each suggestion (or batched by file):
- Show what will change
- Show the evidence for the suggestion
- Allow user to accept, modify, or reject each

### Step 4: Apply Approved Changes
For each approved suggestion:
1. Read the target TELOS file
2. Apply the change using Edit tool
3. Preserve existing structure

### Step 5: Clear Processed Suggestions
After all suggestions are processed, clear the suggestion file or archive it with a timestamp.

## VERIFY Phase (THE CULMINATION)
[INVOKE TaskList to display all ISC criteria]
[INVOKE TaskUpdate for each criterion with evidence]

## LEARN Phase
Write to `MEMORY/LEARNING/TALENT_PROFILE/`:
```
# Learning: Profile Sync — [Date]
## Context — What suggestions were detected and processed
## Insight — Acceptance rate and common rejection reasons
## Implication — How to improve auto-detection accuracy
```

## Output
- Number of suggestions found
- Number accepted / modified / rejected
- Files modified
- Next steps (any manual updates recommended)
