# TalentProfile Skill

**Version:** 1.0.0
**Created:** 2026-02-07
**Location:** `.claude/skills/TalentProfile/`

---

## What It Does

TalentProfile maintains rich professional profiles for each role in the az-demo multi-role collaboration system. Each role (Innovation Lead, R&D Scientist, Data Scientist) keeps structured profile data in TELOS markdown files, which can be exported to JSON for an external matching/marketplace system.

The skill enables people to find collaborators, mentors, and learning opportunities across teams — without requiring PAI to handle the matching itself. PAI maintains and exports; an external system matches.

---

## Architecture

```
TalentProfile Skill
├── TELOS Files (per role)        ← Source of truth (markdown)
├── Workflows (4)                 ← How profiles get updated/exported/reviewed
├── ProfileSchema.md              ← JSON export format definition
├── ProfileSyncDetector hook      ← Auto-detects profile changes from work
└── shared/profiles/*.json        ← Exported JSON for external consumption
```

**Data flow:**
```
Work Sessions → ProfileSyncDetector (hook) → Suggestions File
                                                    ↓
User: "sync my profile" ────────────→ SyncProfile Workflow → TELOS Files
User: "export my profile" ──────────→ ExportProfile Workflow → JSON
User: "update my profile" ──────────→ UpdateProfile Workflow → TELOS Files
User: "review my profile" ──────────→ ReviewProfile Workflow → Gap Report
```

---

## Profile Files (6 per role)

Each role has 6 profile-specific TELOS files in `roles/{role}/TELOS/`:

| File | What It Captures |
|------|-----------------|
| `SKILLS.md` | Technical, domain, and soft skills with proficiency level, years of experience, and last-used date |
| `EXPERIENCE.md` | Career history (title, org, dates, focus) and project history (role, duration, outcome, skills used) |
| `INTERESTS.md` | Professional interests, learning goals with completion tracking, mentoring preferences |
| `AVAILABILITY.md` | Capacity percentage, schedule constraints, project bandwidth table |
| `CERTIFICATIONS.md` | Credentials, education, publications |
| `DOMAIN_EXPERTISE.md` | Primary and secondary domains with depth levels, domain intersection descriptions |

These files use the same markdown format as existing TELOS files (tables, bullet lists, first-person voice) and are automatically picked up by `switch-role.sh` when switching between roles.

---

## Workflows

### UpdateProfile
**Trigger:** "update my profile", "add skill", "update availability"

Conversational profile updates with cross-file awareness. If you completed a project, it knows to update both `EXPERIENCE.md` (project history) and `SKILLS.md` (last-used dates) and possibly `AVAILABILITY.md` (freed capacity).

### ExportProfile
**Trigger:** "export profile", "export to JSON"

Parses all 6 profile TELOS files plus supporting files (MISSION.md, GOALS.md, CHALLENGES.md, BELIEFS.md) into a structured JSON file following `ProfileSchema.md`. Output goes to `shared/profiles/{role-id}.json`.

### ReviewProfile
**Trigger:** "review profile", "profile completeness", "profile gaps"

Analyzes all profile files for:
- **Staleness** — Skills or domains with outdated "last used" dates
- **Gaps** — Missing sections, empty tables, incomplete data
- **Completeness** — Percentage of schema fields populated

Produces actionable suggestions for each gap found.

### SyncProfile
**Trigger:** "sync profile", "update profile from work"

Reads auto-detected suggestions from `shared/profile-suggestions/{role}.md` (written by the ProfileSyncDetector hook), presents each to the user for approval, then applies approved changes to TELOS files.

---

## JSON Export Schema (v1.0.0)

The export schema is flat but designed for evolution via a `schema_version` field. Key sections:

```json
{
  "schema_version": "1.0.0",
  "exported_at": "ISO timestamp",
  "role_id": "data-scientist",
  "identity": { "mission", "current_title", "organization" },
  "skills": [{ "name", "category", "proficiency", "years", "last_used" }],
  "experience": [{ "title", "organization", "start_date", "end_date", "focus" }],
  "project_history": [{ "name", "role_in_project", "duration", "outcome", "skills_used" }],
  "certifications": [{ "name", "issuer", "obtained", "expires", "status" }],
  "education": [{ "degree", "institution", "year", "focus" }],
  "domain_expertise": [{ "domain", "depth", "years", "specific_areas", "priority" }],
  "interests": ["string"],
  "learning_goals": [{ "goal", "target_date", "completed" }],
  "mentoring": { "willing_to_mentor", "seeking_mentorship_in", "preferred_format" },
  "availability": { "percent_available", "preferred_project_size", "timezone" },
  "goals": ["string"],
  "challenges": ["string"],
  "beliefs": ["string"]
}
```

Full schema with field mappings and evolution rules: `.claude/skills/TalentProfile/ProfileSchema.md`

---

## Auto-Sync Hook

**File:** `.claude/hooks/ProfileSyncDetector.hook.ts`
**Trigger:** SessionEnd (runs between WorkCompletionLearning and SessionSummary)

The hook reads work session metadata and detects profile-relevant signals:

| Signal Type | Detection | Suggests Update To |
|-------------|-----------|-------------------|
| Tool/technology usage | Keywords in tools_used or files_changed | `SKILLS.md` last-used dates |
| Project completion | Keywords like "completed", "shipped", "deployed" in work title | `EXPERIENCE.md` project history |
| Significant domain activity | >5 files changed in a session | `DOMAIN_EXPERTISE.md` depth/dates |

The hook **never modifies TELOS files directly**. It writes suggestions to `shared/profile-suggestions/{role}.md` for the user to review via the SyncProfile workflow.

---

## Integration Points

| System | What Changed | Why |
|--------|-------------|-----|
| `settings.json` contextFiles | Added `skills/TalentProfile/SKILL.md` | Skill loaded at session start |
| `settings.json` SessionEnd hooks | Added ProfileSyncDetector between WorkCompletionLearning and SessionSummary | Auto-detection runs at session end |
| `Telos/Tools/UpdateTelos.ts` | Added 6 new filenames to VALID_FILES | Enables safe TELOS updates with backups |
| `Telos/SKILL.md` | Added Talent Profile section + valid files | Documentation and routing |
| `switch-role.sh` | No changes needed | Already uses wildcard copy (`TELOS/*`) |

---

## Directory Structure

```
az-demo/
├── roles/
│   ├── innovation-lead/TELOS/    ← 6 new profile files
│   ├── rd-scientist/TELOS/       ← 6 new profile files
│   └── data-scientist/TELOS/     ← 6 new profile files
├── shared/
│   ├── profiles/                 ← JSON exports land here
│   ├── profile-suggestions/      ← Auto-detected update suggestions
│   └── profile-cache/            ← Tool usage cache for signal detection
└── .claude/
    ├── skills/TalentProfile/
    │   ├── SKILL.md              ← Skill definition
    │   ├── ProfileSchema.md      ← JSON schema reference
    │   └── Workflows/
    │       ├── ExportProfile.md
    │       ├── UpdateProfile.md
    │       ├── ReviewProfile.md
    │       └── SyncProfile.md
    └── hooks/
        └── ProfileSyncDetector.hook.ts
```

---

## Usage Examples

```
"Export my profile to JSON"
→ Parses TELOS files → writes shared/profiles/data-scientist.json

"Update my profile — I just completed the ChemBERTa fine-tuning"
→ Updates EXPERIENCE.md project outcome + SKILLS.md last-used dates

"Review my profile for completeness"
→ Returns gap report: 85% complete, 3 stale skills, missing publications

"Sync my profile from recent work sessions"
→ Reads auto-detected suggestions → presents for approval → applies changes
```

---

## Design Decisions

- **Markdown source of truth, JSON derived export** — Profiles live in TELOS files (human-readable, version-controlled). JSON is generated on demand, not stored as primary data.
- **No matching logic in PAI** — An external system handles matching. PAI focuses on maintaining accurate, rich profile data.
- **Suggestions, not auto-edits** — The ProfileSyncDetector hook writes suggestions but never modifies TELOS files directly. The user always confirms changes.
- **Flat schema, designed for evolution** — v1.0.0 is intentionally flat. The `schema_version` field enables future additions without breaking consumers. Unknown fields should be ignored by consumers (forward-compatible).
- **Cross-file awareness** — UpdateProfile knows that completing a project affects EXPERIENCE.md, SKILLS.md, and AVAILABILITY.md simultaneously.
