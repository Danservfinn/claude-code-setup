---
name: ship-it
description: "Automated workflow to test, update documentation, commit, and deploy changes. Updates project knowledge base. Use /ship-it after completing features or fixes to safely ship code."
---

# Ship It - Test, Document, Commit & Deploy

Automated workflow for shipping code changes safely and consistently, including knowledge base updates.

## Workflow

When invoked, execute these steps in order:

### Step 1: Analyze Changes

```bash
git status
git diff --stat HEAD~1..HEAD 2>/dev/null || git diff --stat
```

Identify what files changed and categorize:
- New files/modules added?
- Existing modules modified?
- Configuration changes?
- New features or APIs?

### Step 2: Run Tests

Run the project's test suite:

```bash
# For BYRD project
pytest -v --tb=short

# Alternative for JS projects
# npm test
```

**CRITICAL:** If tests fail, STOP and report the failures. Do NOT proceed to commit.

### Step 3: Update Project Documentation

Based on what changed, update relevant docs:

| Changed | Update |
|---------|--------|
| New API endpoints | ARCHITECTURE.md |
| New components | ARCHITECTURE.md |
| Config changes | CLAUDE.md |
| User features | README.md |

### Step 4: Update Knowledge Base

Update the `.claude/` knowledge base based on changes:

#### 4a. Record Deployment Observation

Use the `mem-record` skill to record what was shipped:

```
Type: ✅ change
Title: <descriptive title of what shipped>
Content: <summary of changes, files modified, features added>
Files: <list of key files changed>
```

#### 4b. Update Metadata (if modules changed)

If a core module was significantly modified, update its metadata file:

| Module Changed | Update File |
|----------------|-------------|
| agi_runner.py | .claude/metadata/agi-runner.md (create if missing) |
| server.py | .claude/metadata/server-api.md |
| dreamer.py | .claude/metadata/dreamer-module.md |
| seeker.py | .claude/metadata/seeker-module.md |
| memory.py | .claude/metadata/memory-schema.md |
| omega.py | .claude/metadata/omega-system.md |

#### 4c. Update Manifest (if new knowledge added)

If you created new metadata/pattern files, add them to `.claude/manifest.md`:

```markdown
| Title | Type | Path | Tags | Relations | Updated |
|-------|------|------|------|-----------|---------|
| New Entry | metadata | ./.claude/metadata/new-file.md | tags, here | — | YYYY-MM-DD |
```

#### 4d. Update Code Index (if structure changed)

If new Python files were added, update `.claude/code_index/module-index.md`.

### Step 5: Commit

Stage and commit with conventional format:

```bash
git add -A
git commit -m "$(cat <<'EOF'
<type>: <description>

<body if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

Types: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

### Step 6: Deploy

Push to all remotes:

```bash
git push origin main
git push hf main 2>/dev/null || echo "No HuggingFace remote"
```

## Output Format

Report progress like this:

```
🚀 Ship-It Workflow
━━━━━━━━━━━━━━━━━━━

📋 Changes detected:
   - server.py (modified)
   - agi_runner.py (modified)

🧪 Running tests...
   ✅ 94 passed, 0 failed

📝 Documentation:
   - Updated ARCHITECTURE.md (new endpoint)

🧠 Knowledge Base:
   - Recorded observation: "AGI metrics endpoint added"
   - Updated .claude/metadata/agi-runner.md

📦 Committed:
   feat: add comprehensive AGI metrics endpoint

🚀 Deployed:
   ✅ origin/main
   ✅ hf/main

✅ Ship complete!
```

## Knowledge Base Structure

```
.claude/
├── manifest.md           # Index of all knowledge entries
├── metadata/             # Module documentation
│   ├── dreamer-module.md
│   ├── seeker-module.md
│   └── ...
├── patterns/             # Architectural patterns
├── cheatsheets/          # Quick reference guides
├── memory_anchors/       # Key concepts and protocols
└── code_index/           # Code structure index
```

## Arguments

- `/ship-it` - Full workflow
- `/ship-it --skip-tests` - Skip tests (dangerous!)
- `/ship-it --no-deploy` - Commit only, no push
- `/ship-it --no-kb` - Skip knowledge base updates
- `/ship-it --dry-run` - Show what would happen

## Safety Rules

1. Never force push
2. Never skip failing tests without explicit user override
3. Verify test output before proceeding
4. Ask before large documentation rewrites
5. Keep knowledge base updates focused and minimal
