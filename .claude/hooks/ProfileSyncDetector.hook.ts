#!/usr/bin/env bun
/**
 * ProfileSyncDetector.hook.ts - Detect Profile-Relevant Signals from Work Sessions
 *
 * PURPOSE:
 * Analyzes completed work sessions for signals that indicate a talent profile
 * update is warranted. Writes suggestions to shared/profile-suggestions/ for
 * the user to review via the TalentProfile SyncProfile workflow.
 * Does NOT auto-modify TELOS files — only writes suggestions.
 *
 * TRIGGER: SessionEnd
 *
 * INPUT:
 * - stdin: Hook input JSON (session_id, transcript_path)
 * - Files: MEMORY/STATE/current-work.json, MEMORY/WORK/<dir>/META.yaml
 *
 * OUTPUT:
 * - stdout: None
 * - stderr: Status messages
 * - exit(0): Always (non-blocking)
 *
 * SIDE EFFECTS:
 * - Creates/appends: shared/profile-suggestions/{role-name}.md
 *
 * INTER-HOOK RELATIONSHIPS:
 * - DEPENDS ON: AutoWorkCreation (expects WORK/ structure)
 * - MUST RUN AFTER: WorkCompletionLearning (captures after learning is written)
 * - MUST RUN BEFORE: SessionSummary (suggestions ready before summary)
 *
 * SIGNAL DETECTION:
 * A suggestion is created when:
 * - New tools/technologies were used (→ SKILLS.md update)
 * - Project status changed (→ EXPERIENCE.md update)
 * - Significant files changed in a domain area (→ DOMAIN_EXPERTISE.md update)
 * - Work completed on a tracked project (→ EXPERIENCE.md project history)
 *
 * ERROR HANDLING:
 * - No active work: Silent exit
 * - Missing files: Silent exit
 * - Write failures: Logged to stderr, silent exit
 *
 * PERFORMANCE:
 * - Non-blocking: Yes (fire-and-forget at session end)
 * - Typical execution: <100ms
 */

import { writeFileSync, existsSync, readFileSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';
import { getPSTTimestamp } from './lib/time';

const MEMORY_DIR = join(process.env.HOME!, '.claude', 'MEMORY');
const STATE_DIR = join(MEMORY_DIR, 'STATE');
const CURRENT_WORK_FILE = join(STATE_DIR, 'current-work.json');
const WORK_DIR = join(MEMORY_DIR, 'WORK');

const SHARED_DIR = process.env.SHARED_DIR || join(process.env.HOME!, 'Personal_Projects', 'az-demo', 'shared');
const SUGGESTIONS_DIR = join(SHARED_DIR, 'profile-suggestions');

// Detect active role from TELOS MISSION.md content
const TELOS_DIR = join(process.env.HOME!, '.claude', 'skills', 'PAI', 'USER', 'TELOS');

interface CurrentWork {
  session_id: string;
  work_dir: string;
  created_at: string;
  item_count: number;
}

// Tool/technology patterns that map to profile skill categories
const TOOL_SIGNALS: Record<string, { file: string; category: string }> = {
  'pytorch': { file: 'SKILLS.md', category: 'technical' },
  'transformers': { file: 'SKILLS.md', category: 'technical' },
  'scikit-learn': { file: 'SKILLS.md', category: 'technical' },
  'xgboost': { file: 'SKILLS.md', category: 'technical' },
  'shap': { file: 'SKILLS.md', category: 'technical' },
  'playwright': { file: 'SKILLS.md', category: 'technical' },
  'flow cytometry': { file: 'SKILLS.md', category: 'domain' },
  'assay': { file: 'DOMAIN_EXPERTISE.md', category: 'domain' },
  'clinical trial': { file: 'DOMAIN_EXPERTISE.md', category: 'domain' },
  'cheminformatics': { file: 'DOMAIN_EXPERTISE.md', category: 'domain' },
};

// Project status keywords that suggest EXPERIENCE.md updates
const PROJECT_SIGNALS = [
  'completed', 'shipped', 'deployed', 'launched', 'published',
  'pilot', 'production', 'released', 'finished'
];

function detectActiveRole(): string {
  try {
    const missionPath = join(TELOS_DIR, 'MISSION.md');
    if (!existsSync(missionPath)) return 'unknown';
    const mission = readFileSync(missionPath, 'utf-8').toLowerCase();

    if (mission.includes('champion ai-driven') || mission.includes('innovation')) return 'innovation-lead';
    if (mission.includes('experiments that validate') || mission.includes('assay')) return 'rd-scientist';
    if (mission.includes('ml models') || mission.includes('data scientist')) return 'data-scientist';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function parseWorkMeta(content: string): { title: string; tools_used: string[]; files_changed: string[] } {
  const result = { title: '', tools_used: [] as string[], files_changed: [] as string[] };
  const lines = content.split('\n');
  let currentArray: string[] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('title:')) {
      result.title = trimmed.replace('title:', '').trim().replace(/^["']|["']$/g, '');
    }
    if (trimmed === 'tools_used:') { currentArray = result.tools_used; continue; }
    if (trimmed === 'files_changed:') { currentArray = result.files_changed; continue; }
    if (trimmed.startsWith('- ') && currentArray) {
      currentArray.push(trimmed.slice(2).replace(/^["']|["']$/g, ''));
      continue;
    }
    if (trimmed.match(/^[a-z_]+:/) && !trimmed.startsWith('- ')) {
      currentArray = null;
    }
  }

  return result;
}

function detectSignals(workMeta: { title: string; tools_used: string[]; files_changed: string[] }): string[] {
  const suggestions: string[] = [];
  const timestamp = getPSTTimestamp();
  const allText = [
    workMeta.title,
    ...workMeta.tools_used,
    ...workMeta.files_changed
  ].join(' ').toLowerCase();

  // Check for tool/technology signals
  for (const [keyword, signal] of Object.entries(TOOL_SIGNALS)) {
    if (allText.includes(keyword)) {
      suggestions.push(
        `## ${timestamp} — Tool/Technology Usage\n` +
        `- **File:** ${signal.file}\n` +
        `- **Field:** ${signal.category} skills\n` +
        `- **Suggested Change:** Update "Last Used" date for ${keyword}-related skills\n` +
        `- **Evidence:** Used in work session: "${workMeta.title}"\n`
      );
    }
  }

  // Check for project completion signals
  const titleLower = workMeta.title.toLowerCase();
  for (const signal of PROJECT_SIGNALS) {
    if (titleLower.includes(signal)) {
      suggestions.push(
        `## ${timestamp} — Project Status Change\n` +
        `- **File:** EXPERIENCE.md\n` +
        `- **Field:** Project History\n` +
        `- **Suggested Change:** Update project outcome for "${workMeta.title}"\n` +
        `- **Evidence:** Work session title contains "${signal}"\n`
      );
      break; // Only one project signal per session
    }
  }

  // Check for significant file changes (>5 files suggests deep domain work)
  if (workMeta.files_changed.length > 5) {
    suggestions.push(
      `## ${timestamp} — Significant Domain Activity\n` +
      `- **File:** DOMAIN_EXPERTISE.md\n` +
      `- **Field:** Domain depth/last-used\n` +
      `- **Suggested Change:** Review domain expertise dates after significant session (${workMeta.files_changed.length} files changed)\n` +
      `- **Evidence:** Work session "${workMeta.title}" touched ${workMeta.files_changed.length} files\n`
    );
  }

  return suggestions;
}

async function main() {
  try {
    // Read input from stdin (required for hook pattern)
    const input = await Bun.stdin.text();
    if (!input || input.trim() === '') {
      process.exit(0);
    }

    // Check if there's an active work session
    if (!existsSync(CURRENT_WORK_FILE)) {
      console.error('[ProfileSyncDetector] No active work session');
      process.exit(0);
    }

    // Read current work state
    const currentWork: CurrentWork = JSON.parse(readFileSync(CURRENT_WORK_FILE, 'utf-8'));

    if (!currentWork.work_dir) {
      console.error('[ProfileSyncDetector] No work directory in current session');
      process.exit(0);
    }

    // Read work directory metadata
    const workPath = join(WORK_DIR, currentWork.work_dir);
    const metaPath = join(workPath, 'META.yaml');

    if (!existsSync(metaPath)) {
      console.error('[ProfileSyncDetector] No META.yaml found');
      process.exit(0);
    }

    const metaContent = readFileSync(metaPath, 'utf-8');
    const workMeta = parseWorkMeta(metaContent);

    // Detect profile-relevant signals
    const suggestions = detectSignals(workMeta);

    if (suggestions.length === 0) {
      console.error('[ProfileSyncDetector] No profile-relevant signals detected');
      process.exit(0);
    }

    // Detect active role
    const role = detectActiveRole();
    if (role === 'unknown') {
      console.error('[ProfileSyncDetector] Could not detect active role');
      process.exit(0);
    }

    // Ensure suggestions directory exists
    if (!existsSync(SUGGESTIONS_DIR)) {
      mkdirSync(SUGGESTIONS_DIR, { recursive: true });
    }

    // Append suggestions to role-specific file
    const suggestionsFile = join(SUGGESTIONS_DIR, `${role}.md`);
    const header = existsSync(suggestionsFile)
      ? ''
      : `# Profile Update Suggestions — ${role}\n\nAuto-detected changes from work sessions. Review with "sync my profile".\n\n`;

    const content = header + suggestions.join('\n') + '\n';

    if (existsSync(suggestionsFile)) {
      appendFileSync(suggestionsFile, '\n' + suggestions.join('\n') + '\n');
    } else {
      writeFileSync(suggestionsFile, content);
    }

    console.error(`[ProfileSyncDetector] ${suggestions.length} suggestion(s) written for ${role}`);
    process.exit(0);
  } catch (error) {
    // Silent failure - don't disrupt workflow
    console.error(`[ProfileSyncDetector] Error: ${error}`);
    process.exit(0);
  }
}

main();
