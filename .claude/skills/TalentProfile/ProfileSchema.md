# TalentProfile JSON Schema (v1.0.0)

## Overview
This document defines the JSON export format for talent profiles. The schema is flat but designed for evolution via the `schema_version` field.

## Schema

```json
{
  "schema_version": "1.0.0",
  "exported_at": "2026-02-07T19:25:46.000Z",
  "role_id": "data-scientist",

  "identity": {
    "mission": "string — from MISSION.md",
    "current_title": "string — from EXPERIENCE.md (most recent career entry)",
    "organization": "string — from EXPERIENCE.md (most recent career entry)"
  },

  "skills": [
    {
      "name": "string",
      "category": "technical | domain | soft",
      "proficiency": "foundational | intermediate | advanced | expert",
      "years": "number",
      "last_used": "string (YYYY-MM)"
    }
  ],

  "experience": [
    {
      "title": "string",
      "organization": "string",
      "start_date": "string (YYYY-MM)",
      "end_date": "string (YYYY-MM) | 'Present'",
      "focus": "string"
    }
  ],

  "project_history": [
    {
      "name": "string",
      "role_in_project": "string",
      "duration": "string (YYYY-MM – YYYY-MM | 'present')",
      "outcome": "string",
      "skills_used": "string"
    }
  ],

  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "obtained": "string (YYYY)",
      "expires": "string (YYYY) | null",
      "status": "Active | Expired | Complete | Renewal pending"
    }
  ],

  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string (YYYY)",
      "focus": "string"
    }
  ],

  "domain_expertise": [
    {
      "domain": "string",
      "depth": "foundational | intermediate | advanced | expert",
      "years": "number",
      "specific_areas": "string",
      "priority": "Primary | Supporting | Emerging"
    }
  ],

  "interests": ["string"],

  "learning_goals": [
    {
      "goal": "string",
      "target_date": "string | null",
      "completed": "boolean"
    }
  ],

  "mentoring": {
    "willing_to_mentor": ["string — topics"],
    "seeking_mentorship_in": ["string — topics"],
    "preferred_format": "string"
  },

  "availability": {
    "percent_available": "number (0-100)",
    "preferred_project_size": "string",
    "timezone": "string",
    "last_updated": "string (YYYY-MM-DD)"
  },

  "goals": ["string — from GOALS.md"],
  "challenges": ["string — from CHALLENGES.md"],
  "beliefs": ["string — from BELIEFS.md"]
}
```

## Field Mapping (TELOS → JSON)

| JSON Field | Source File | Source Section |
|-----------|------------|---------------|
| `identity.mission` | `MISSION.md` | First paragraph |
| `identity.current_title` | `EXPERIENCE.md` | Career History, most recent row, Title column |
| `identity.organization` | `EXPERIENCE.md` | Career History, most recent row, Organization column |
| `skills[]` | `SKILLS.md` | Technical Skills + Domain Skills tables (category=technical/domain), Soft Skills list (category=soft) |
| `experience[]` | `EXPERIENCE.md` | Career History table |
| `project_history[]` | `EXPERIENCE.md` | Project History table |
| `certifications[]` | `CERTIFICATIONS.md` | Credentials table |
| `education[]` | `CERTIFICATIONS.md` | Education table |
| `domain_expertise[]` | `DOMAIN_EXPERTISE.md` | Primary Domains + Secondary Domains tables |
| `interests[]` | `INTERESTS.md` | Professional Interests list |
| `learning_goals[]` | `INTERESTS.md` | Learning Goals list (parse checkbox state) |
| `mentoring` | `INTERESTS.md` | Mentoring Preferences section |
| `availability` | `AVAILABILITY.md` | Current Capacity section |
| `goals[]` | `GOALS.md` | All goals as flat list |
| `challenges[]` | `CHALLENGES.md` | All challenges as flat list |
| `beliefs[]` | `BELIEFS.md` | All beliefs as flat list |

## Schema Evolution Rules

1. **Adding fields:** New optional fields can be added without version bump (backward compatible)
2. **Removing fields:** Requires major version bump (2.0.0)
3. **Changing field types:** Requires major version bump (2.0.0)
4. **Adding new required fields:** Requires minor version bump (1.1.0)
5. **External consumers** should ignore unknown fields (forward compatible)

## Export Location
```
shared/profiles/{role-id}.json
```
Examples:
- `shared/profiles/innovation-lead.json`
- `shared/profiles/rd-scientist.json`
- `shared/profiles/data-scientist.json`
