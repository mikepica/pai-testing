# TalentProfile JSON Schema (v2.0.0)

## Overview
This schema exports talent profiles in a **narrative-first** format designed to be consumed by a downstream system that builds a person's profile. The export must answer four questions in order:

1. **Who is this person?** (narrative layer)
2. **What can they do?** (capabilities layer — with motivation)
3. **What have they done?** (evidence layer)
4. **What's happening now?** (signal layer — current state and direction)

## Design Principles
- **Narrative before data** — Lead with synthesized understanding, not raw facts
- **Motivation attached to capability** — Every skill and goal has a "why"
- **Evaluable** — A consuming system can assess fit without reconstructing the story from fragments
- **Layered** — narrative → capabilities → evidence → signal, each layer adds depth

## Schema

```json
{
  "schema_version": "2.0.0",
  "exported_at": "2026-02-08T00:00:00.000Z",
  "role_id": "innovation-lead",

  "narrative": {
    "summary": "string — 3-4 sentence synthesized identity. Who this person is, what they do, what makes them distinctive. Written for a system that needs to understand and represent this person.",
    "mission": "string — from MISSION.md, their driving purpose",
    "value_proposition": "string — what they uniquely offer that others in similar roles don't. Synthesized from domain intersections + mission + beliefs.",
    "trajectory": "string — where they're heading. Career path, timeline, what they're building toward. From MISSION.md career trajectory + GOALS.md.",
    "operating_principles": ["string — from BELIEFS.md. Core principles that govern how they work and decide."],
    "domain_intersections": ["string — from DOMAIN_EXPERTISE.md intersections. The cross-domain connections that define their unique perspective."],
    "challenges_they_solve": ["string — from CHALLENGES.md. The problems they're actively working to solve in their organization."]
  },

  "capabilities": {
    "current_skills": [
      {
        "name": "string",
        "category": "technical | domain | soft",
        "proficiency": "foundational | intermediate | advanced | expert",
        "years": "number",
        "last_used": "string (YYYY-MM) | null",
        "why": "string — why this skill matters to their mission. Synthesized from context."
      }
    ],
    "developing": [
      {
        "name": "string",
        "current_level": "none | foundational | intermediate",
        "target_level": "foundational | intermediate | advanced | expert",
        "timeline": "string (e.g., 'Q2-Q3 2026')",
        "why": "string — why they're developing this. From Skills to Develop tables."
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
    ]
  },

  "evidence": {
    "career": [
      {
        "title": "string",
        "organization": "string",
        "start_date": "string (YYYY-MM)",
        "end_date": "string (YYYY-MM) | 'Present'",
        "focus": "string"
      }
    ],
    "projects": [
      {
        "name": "string",
        "role_in_project": "string",
        "duration": "string",
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
        "status": "Active | Expired | Renewal pending"
      }
    ],
    "education": [
      {
        "degree": "string",
        "institution": "string",
        "year": "string (YYYY)",
        "focus": "string"
      }
    ]
  },

  "current_state": {
    "active_projects": [
      {
        "name": "string",
        "role": "string",
        "status": "string"
      }
    ],
    "learning_goals": [
      {
        "goal": "string",
        "target_date": "string | null",
        "completed": "boolean"
      }
    ],
    "availability": {
      "percent_available": "number (0-100)",
      "preferred_project_size": "string",
      "timezone": "string",
      "last_updated": "string (YYYY-MM-DD)"
    },
    "seeking": ["string — mentorship topics, collaboration types, opportunities they want"],
    "offering": ["string — what they can mentor on, contribute, or teach"]
  }
}
```

## Field Mapping (TELOS → JSON)

### Narrative Layer (synthesized, not direct copy)
| JSON Field | Source Files | Synthesis |
|-----------|-------------|-----------|
| `narrative.summary` | MISSION.md, EXPERIENCE.md, DOMAIN_EXPERTISE.md | AI-synthesized 3-4 sentence identity |
| `narrative.mission` | MISSION.md | First paragraph |
| `narrative.value_proposition` | MISSION.md, DOMAIN_EXPERTISE.md (intersections), BELIEFS.md | Synthesized from what makes them distinctive |
| `narrative.trajectory` | MISSION.md (career trajectory), GOALS.md | Career path and timeline |
| `narrative.operating_principles` | BELIEFS.md | Direct extraction |
| `narrative.domain_intersections` | DOMAIN_EXPERTISE.md | Domain Intersections section |
| `narrative.challenges_they_solve` | CHALLENGES.md | Direct extraction |

### Capabilities Layer
| JSON Field | Source File | Source Section |
|-----------|------------|---------------|
| `capabilities.current_skills[]` | SKILLS.md | Technical + Domain + Soft skills. `why` is synthesized from mission context. |
| `capabilities.developing[]` | SKILLS.md | Skills to Develop tables (Tier 1, 2, 3) |
| `capabilities.domain_expertise[]` | DOMAIN_EXPERTISE.md | Primary + Secondary Domains tables |

### Evidence Layer
| JSON Field | Source File | Source Section |
|-----------|------------|---------------|
| `evidence.career[]` | EXPERIENCE.md | Career History table |
| `evidence.projects[]` | EXPERIENCE.md | Project History table |
| `evidence.certifications[]` | CERTIFICATIONS.md | Credentials table |
| `evidence.education[]` | CERTIFICATIONS.md | Education table |

### Signal Layer
| JSON Field | Source File | Source Section |
|-----------|------------|---------------|
| `current_state.active_projects[]` | AVAILABILITY.md | Project Bandwidth table (Active slots only) |
| `current_state.learning_goals[]` | INTERESTS.md | Learning Goals list |
| `current_state.availability` | AVAILABILITY.md | Current Capacity section |
| `current_state.seeking[]` | INTERESTS.md | Seeking Mentorship In |
| `current_state.offering[]` | INTERESTS.md | Willing to Mentor On |

## Schema Evolution Rules

1. **Adding optional fields:** No version bump needed (backward compatible)
2. **Removing fields:** Requires major version bump (3.0.0)
3. **Changing field types:** Requires major version bump (3.0.0)
4. **Adding required fields:** Requires minor version bump (2.1.0)
5. **External consumers** should ignore unknown fields (forward compatible)

## Export Location
```
shared/profiles/{role-id}.json
```
