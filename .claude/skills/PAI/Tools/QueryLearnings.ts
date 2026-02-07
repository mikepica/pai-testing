#!/usr/bin/env bun
/**
 * QueryLearnings.ts - Query past learnings from MEMORY/LEARNING
 *
 * Read path for the PAI memory feedback loop. Searches and filters
 * learning files captured by ResponseCapture, ExplicitRatingCapture,
 * and ImplicitSentimentCapture hooks.
 *
 * Commands:
 *   bun QueryLearnings.ts <query>               Text search across all learnings
 *   bun QueryLearnings.ts --category ALGORITHM   Filter by category (ALGORITHM|SYSTEM)
 *   bun QueryLearnings.ts --recent N             Last N learnings by date
 *   bun QueryLearnings.ts --since 2026-01-01     Learnings after date
 *   bun QueryLearnings.ts --smart <query>        AI-powered relevance ranking
 *   bun QueryLearnings.ts --list                 List all learnings
 *   bun QueryLearnings.ts --stats                Statistics summary
 *
 * Module Usage:
 *   import { queryLearnings, getLearningStats } from './QueryLearnings'
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { parseArgs } from 'util';
import { inference } from './Inference';
import { getPaiDir } from '../../../hooks/lib/paths';

// ============================================================================
// Configuration
// ============================================================================

const LEARNING_DIR = join(getPaiDir(), 'MEMORY', 'LEARNING');
const CATEGORIES = ['ALGORITHM', 'SYSTEM'] as const;

// ============================================================================
// Types
// ============================================================================

interface LearningFile {
  path: string;
  filename: string;
  category: string;
  date: string;
  content: string;
  frontmatter: Record<string, string>;
  summary: string;
  insight: string;
}

interface LearningStats {
  total: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  bySource: Record<string, number>;
  oldestDate: string;
  newestDate: string;
}

// ============================================================================
// File Discovery
// ============================================================================

function discoverLearningFiles(category?: string): LearningFile[] {
  const files: LearningFile[] = [];
  const categories = category ? [category.toUpperCase()] : CATEGORIES;

  for (const cat of categories) {
    const catDir = join(LEARNING_DIR, cat);
    if (!existsSync(catDir)) continue;

    // Iterate month directories (e.g., 2026-02/)
    for (const monthDir of readdirSync(catDir)) {
      const monthPath = join(catDir, monthDir);
      if (!statSync(monthPath).isDirectory()) continue;

      for (const file of readdirSync(monthPath)) {
        if (!file.endsWith('.md')) continue;
        const filePath = join(monthPath, file);
        try {
          const content = readFileSync(filePath, 'utf-8');
          const parsed = parseLearningFile(content, filePath, cat);
          if (parsed) files.push(parsed);
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  // Sort by date descending (newest first)
  return files.sort((a, b) => b.date.localeCompare(a.date));
}

function parseLearningFile(content: string, filePath: string, category: string): LearningFile | null {
  const frontmatter: Record<string, string> = {};

  // Parse YAML frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        frontmatter[key] = value;
      }
    }
  }

  // Extract date from filename (e.g., 2026-02-07-160442_LEARNING_...)
  const dateMatch = basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : frontmatter.timestamp?.slice(0, 10) || '0000-00-00';

  // Extract summary — look for ## Summary section or first heading content
  let summary = '';
  const summaryMatch = content.match(/## Summary\s*\n\s*\n?([\s\S]*?)(?=\n## |\n---|\n<details|$)/);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }

  // Extract key insight
  let insight = '';
  const insightMatch = content.match(/## Key Insight\s*\n\s*\n?([\s\S]*?)(?=\n## |\n---|\n<details|$)/);
  if (insightMatch) {
    insight = insightMatch[1].trim();
  }

  return {
    path: filePath,
    filename: basename(filePath),
    category,
    date,
    content,
    frontmatter,
    summary,
    insight,
  };
}

// ============================================================================
// Query Functions
// ============================================================================

export function queryLearnings(query: string, options?: { category?: string; since?: string; limit?: number }): LearningFile[] {
  let files = discoverLearningFiles(options?.category);

  if (options?.since) {
    files = files.filter(f => f.date >= options.since!);
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    files = files.filter(f =>
      f.content.toLowerCase().includes(lowerQuery) ||
      f.filename.toLowerCase().includes(lowerQuery)
    );
  }

  if (options?.limit) {
    files = files.slice(0, options.limit);
  }

  return files;
}

export function getLearningStats(): LearningStats {
  const files = discoverLearningFiles();
  const stats: LearningStats = {
    total: files.length,
    byCategory: {},
    byMonth: {},
    bySource: {},
    oldestDate: files.length > 0 ? files[files.length - 1].date : 'N/A',
    newestDate: files.length > 0 ? files[0].date : 'N/A',
  };

  for (const f of files) {
    stats.byCategory[f.category] = (stats.byCategory[f.category] || 0) + 1;

    const month = f.date.slice(0, 7);
    stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;

    const source = f.frontmatter.source || 'unknown';
    stats.bySource[source] = (stats.bySource[source] || 0) + 1;
  }

  return stats;
}

// ============================================================================
// Display Helpers
// ============================================================================

function displayLearning(f: LearningFile, verbose: boolean): void {
  console.log(`\n📄 ${f.filename}`);
  console.log(`   Category: ${f.category} | Date: ${f.date} | Source: ${f.frontmatter.source || 'unknown'}`);
  if (f.summary && f.summary !== 'N/A') {
    const truncated = f.summary.length > 120 ? f.summary.slice(0, 117) + '...' : f.summary;
    console.log(`   Summary: ${truncated}`);
  }
  if (f.insight && f.insight !== 'N/A') {
    const truncated = f.insight.length > 120 ? f.insight.slice(0, 117) + '...' : f.insight;
    console.log(`   Insight: ${truncated}`);
  }
  if (verbose) {
    console.log(`   Path: ${f.path}`);
  }
}

function displayStats(stats: LearningStats): void {
  console.log(`\n📊 Learning Statistics`);
  console.log(`   Total: ${stats.total}`);
  console.log(`   Date range: ${stats.oldestDate} → ${stats.newestDate}`);

  console.log(`\n   By Category:`);
  for (const [cat, count] of Object.entries(stats.byCategory)) {
    console.log(`     ${cat}: ${count}`);
  }

  console.log(`\n   By Month:`);
  for (const [month, count] of Object.entries(stats.byMonth).sort()) {
    console.log(`     ${month}: ${count}`);
  }

  console.log(`\n   By Source:`);
  for (const [source, count] of Object.entries(stats.bySource)) {
    console.log(`     ${source}: ${count}`);
  }
}

// ============================================================================
// CLI
// ============================================================================

if (import.meta.main) {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      category: { type: 'string', short: 'c' },
      recent: { type: 'string', short: 'r' },
      since: { type: 'string', short: 's' },
      smart: { type: 'boolean' },
      list: { type: 'boolean', short: 'l' },
      stats: { type: 'boolean' },
      verbose: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  if (values.help || (!positionals.length && !values.list && !values.stats && !values.recent && !values.category)) {
    console.log(`
QueryLearnings - Search and filter past learnings

Usage:
  bun QueryLearnings.ts <query>                 Text search across all learnings
  bun QueryLearnings.ts --category ALGORITHM    Filter by category (ALGORITHM|SYSTEM)
  bun QueryLearnings.ts --recent N              Last N learnings by date
  bun QueryLearnings.ts --since 2026-01-01      Learnings after date
  bun QueryLearnings.ts --smart <query>         AI-powered relevance ranking
  bun QueryLearnings.ts --list                  List all learnings
  bun QueryLearnings.ts --stats                 Statistics summary

Options:
  -c, --category   Filter by ALGORITHM or SYSTEM
  -r, --recent     Show last N learnings
  -s, --since      Filter by date (YYYY-MM-DD)
  --smart          Use AI to rank results by relevance
  -l, --list       List all learning files
  --stats          Show statistics
  -v, --verbose    Show file paths
  -h, --help       Show this help
`);
    process.exit(0);
  }

  // Stats mode
  if (values.stats) {
    const stats = getLearningStats();
    displayStats(stats);
    process.exit(0);
  }

  // Build query options
  const query = positionals.join(' ');
  const limit = values.recent ? parseInt(values.recent, 10) : undefined;

  let results = queryLearnings(query, {
    category: values.category,
    since: values.since,
    limit: values.list ? undefined : limit,
  });

  // Smart mode: use AI to rank results
  if (values.smart && query && results.length > 1) {
    console.log(`🤖 Ranking ${results.length} results by relevance to: "${query}"...`);

    const summaries = results.map((f, i) =>
      `[${i}] ${f.filename} | ${f.summary || 'No summary'} | ${f.insight || 'No insight'}`
    ).join('\n');

    const aiResult = await inference({
      systemPrompt: 'You are a relevance ranker. Given a query and a list of learning summaries, return a JSON array of indices sorted by relevance (most relevant first). Only return the JSON array, nothing else.',
      userPrompt: `Query: "${query}"\n\nLearnings:\n${summaries}`,
      level: 'fast',
      expectJson: true,
    });

    if (aiResult.success && Array.isArray(aiResult.parsed)) {
      const ranked: LearningFile[] = [];
      for (const idx of aiResult.parsed) {
        if (typeof idx === 'number' && idx >= 0 && idx < results.length) {
          ranked.push(results[idx]);
        }
      }
      if (ranked.length > 0) {
        results = ranked;
      }
    }
  }

  // Apply limit for list mode
  if (values.list && limit) {
    results = results.slice(0, limit);
  }

  // Display results
  if (results.length === 0) {
    console.log('No learnings found matching your query.');
    process.exit(0);
  }

  console.log(`\n📚 Found ${results.length} learning${results.length === 1 ? '' : 's'}:`);

  for (const f of results) {
    displayLearning(f, !!values.verbose);
  }
}
