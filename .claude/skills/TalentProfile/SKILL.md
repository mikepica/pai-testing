---
name: TalentProfile
version: 1.0.0
description: >
  Maintain and export professional talent profiles for cross-team collaboration.
  USE WHEN user says "update my profile", "export profile", "review profile",
  "sync profile", "talent profile", "what are my skills", "export to JSON",
  "profile completeness", "profile gaps".
  Works with The Algorithm as the execution engine.
---

# TalentProfile Skill

## Purpose
Help each role maintain a rich professional profile through TELOS files, exportable to JSON for an external matching/marketplace system. This enables people to find collaborators, mentors, and learning opportunities across teams.

## How This Skill Works With The Algorithm
This skill does NOT bypass The Algorithm. Each workflow below describes what ISC rows to create and which thinking tools are relevant. The Algorithm handles execution, verification, and learning.

## Profile Files (in TELOS/)
Each role maintains 6 profile files alongside their existing TELOS context:

| File | Purpose |
|------|---------|
| `SKILLS.md` | Technical, domain, and soft skills with proficiency/years/last-used |
| `EXPERIENCE.md` | Career history + project history table |
| `INTERESTS.md` | Professional interests, learning goals, mentoring preferences |
| `AVAILABILITY.md` | Capacity %, schedule constraints, project bandwidth |
| `CERTIFICATIONS.md` | Credentials, education, publications |
| `DOMAIN_EXPERTISE.md` | Primary/secondary domains with depth levels, domain intersections |

## Workflow Routing
| Workflow | Trigger | File |
|----------|---------|------|
| **UpdateProfile** | "update my profile", "add skill", "update availability" | `Workflows/UpdateProfile.md` |
| **ExportProfile** | "export profile", "export to JSON", "generate profile JSON" | `Workflows/ExportProfile.md` |
| **ReviewProfile** | "review profile", "profile completeness", "profile gaps", "stale profile" | `Workflows/ReviewProfile.md` |
| **SyncProfile** | "sync profile", "update profile from work", "auto-update profile" | `Workflows/SyncProfile.md` |

## Examples (REQUIRED)

### Example 1: Export profile to JSON
**User**: "Export my profile to JSON"
**Behavior**: Routes to ExportProfile → reads all 6 profile TELOS files + MISSION.md/GOALS.md/CHALLENGES.md/BELIEFS.md → parses markdown tables → writes structured JSON to `shared/profiles/{role}.json` → reports schema version and field completeness

### Example 2: Update profile after new work
**User**: "Update my profile — I just completed the ChemBERTa fine-tuning"
**Behavior**: Routes to UpdateProfile → reads current SKILLS.md + EXPERIENCE.md + PROJECTS.md → conversationally identifies what changed → updates relevant TELOS files → logs changes

### Example 3: Review profile for gaps
**User**: "Review my profile for completeness"
**Behavior**: Routes to ReviewProfile → reads all 6 profile files → checks staleness (last_used dates), empty sections, missing data → produces gap report with specific suggestions

### Example 4: Sync profile from recent work
**User**: "Sync my profile from recent work sessions"
**Behavior**: Routes to SyncProfile → reads `shared/profile-suggestions/{role}.md` if it exists → presents detected changes → asks for confirmation before updating TELOS files

## Key Principles
- PAI only maintains + exports profile data — an external system handles matching
- Profile updates happen both explicitly (user asks) and via suggestions (auto-detected from work sessions)
- JSON schema is flat but designed for evolution (schema_version field)
- TELOS files are the source of truth; JSON is a derived export

## Algorithm Format Rules (apply to all workflows)
When The Algorithm executes these workflows:
- First output token MUST be 🤖 (triggers Algorithm format)
- Response depth is classified: FULL for exports/reviews, ITERATION for updates
- OBSERVE phase begins with reverse-engineering the user's request
- ISC managed via TaskCreate/TaskList/TaskUpdate — never manual tables
- THINK phase includes mandatory Thinking Tools Assessment with justify-exclusion
