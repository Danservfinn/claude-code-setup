# Claude Code Setup

A complete configuration package for Claude Code, including plugins, skills, agents, commands, and MCP servers.

## Quick Install

```bash
# Clone and run installer
git clone https://github.com/Danservfinn/claude-code-setup.git
cd claude-code-setup
chmod +x install.sh
./install.sh
```

Or run directly:

```bash
curl -fsSL https://raw.githubusercontent.com/Danservfinn/claude-code-setup/main/install.sh | bash
```

## What's Included

### Enabled Plugins (23)

| Plugin | Source | Description |
|--------|--------|-------------|
| `claude-mem` | thedotmack | Memory and context management |
| `hookify` | claude-plugins-official | Hook creation and management |
| `ralph-loop` | claude-plugins-official | Autonomous loop execution |
| `feature-dev` | claude-plugins-official | Feature development workflow |
| `playwright` | claude-plugins-official | Browser automation with Playwright |
| `supabase` | claude-plugins-official | Supabase integration |
| `vercel` | claude-plugins-official | Vercel deployment integration |
| `code-simplifier` | claude-plugins-official | Code simplification tools |
| `chrome-devtools-mcp` | chrome-devtools-plugins | Chrome DevTools integration |
| `agent-orchestration` | claude-code-workflows | Multi-agent orchestration |
| `beads` | beads-marketplace | Workflow beads system |
| `backend-development` | claude-code-workflows | Backend development agents |
| `frontend-mobile-development` | claude-code-workflows | Frontend/mobile development |
| `payment-processing` | claude-code-workflows | Payment integration helpers |
| `python-development` | claude-code-workflows | Python development agents |
| `ralph-wiggum` | claude-code-plugins | Enhanced capabilities |
| `frontend-design` | claude-plugins-official | Frontend design tools |
| `agent-sdk-dev` | claude-plugins-official | Agent SDK development |
| `code-review` | claude-plugins-official | Automated code review |
| `database-migrations` | claude-code-workflows | Database migration helpers |
| `stripe` | claude-plugins-official | Stripe integration |
| `commit-commands` | claude-code-plugins | Git commit helpers |
| `feature-dev` | claude-code-plugins | Feature development |

### Plugin Marketplaces

| Marketplace | Repository |
|-------------|------------|
| claude-plugins-official | anthropics/claude-plugins-official |
| claude-code-plugins | anthropics/claude-code |
| claude-code-workflows | wshobson/agents |
| chrome-devtools-plugins | ChromeDevTools/chrome-devtools-mcp |
| thedotmack | thedotmack/claude-mem |
| beads-marketplace | steveyegge/beads |
| awesome-claude-skills | ComposioHQ/awesome-claude-skills |
| anthropic-agent-skills | anthropics/skills |
| payload-marketplace | payloadcms/payload |

### Skills (55)

Specialized capabilities including:

**Development**
- `senior-frontend` - React, Next.js, TypeScript frontend development
- `senior-backend` - Node.js, Express, API development
- `senior-fullstack` - Full-stack application development
- `senior-devops` - CI/CD, infrastructure, deployment

**AI/ML**
- `senior-ml-engineer` - ML model development and deployment
- `senior-data-scientist` - Data analysis and modeling
- `senior-computer-vision` - Vision AI and image processing
- `senior-data-engineer` - Data pipelines and ETL
- `senior-prompt-engineer` - LLM prompt optimization

**Architecture & Leadership**
- `senior-architect` - System architecture design
- `cto-advisor` - Technical leadership guidance
- `ceo-advisor` - Executive strategy
- `product-strategist` - Product development strategy
- `c-suite` - Executive-level business operations

**Quality & Review**
- `code-reviewer` - Automated code review
- `systematic-debugging` - Root cause analysis
- `critical-reviewer` - Adversarial analysis
- `verification-before-completion` - Pre-completion checks
- `subagent-driven-development` - Multi-agent development

**Workflow & Automation**
- `ship-it` - Deployment automation
- `brainstorming` - Creative exploration
- `writing-plans` - Implementation planning
- `executing-plans` - Plan execution
- `dispatching-parallel-agents` - Parallel task management

**Design & UX**
- `frontend-design` - UI/UX design
- `ux-researcher-designer` - User research
- `ui-design-system` - Design system creation
- `theme-factory` - Theme styling
- `web-artifacts-builder` - Complex artifact creation

**Business & Operations**
- `kurultai-coo` - Business operations
- `parse-cfo` - Financial operations
- `molt` - Moltbot configuration

**Content & Documentation**
- `content-research-writer` - Research-based writing
- `changelog-generator` - Release notes generation
- `skill-creator` - Custom skill development

**And more...**

### Agents (15)

Expert agents for specific domains:
- `agent-expert` - Create specialized Claude Code agents
- `architect-reviewer` - Architecture consistency review
- `data-scientist` - Data analysis and modeling
- `documentation-expert` - Technical documentation
- `frontend-developer` - React and frontend development
- `nextjs-architecture-expert` - Next.js optimization
- `python-pro` - Python expertise
- `security-auditor` - Security review
- `mlops-engineer` - ML operations
- `dependency-manager` - Dependency analysis
- `architecture-modernizer` - System modernization
- `react-performance-optimizer` - React optimization
- `url-context-validator` - URL validation
- `url-link-extractor` - Link extraction
- `web-accessibility-checker` - Accessibility audits

### MCP Servers (8)

| Server | Purpose |
|--------|---------|
| `chrome-devtools` | Chrome DevTools Protocol integration |
| `notion-slim` | Notion API integration |
| `railway` | Railway deployment management |
| `railway-logs` | Railway log analysis |
| `postgres-prod` | Production PostgreSQL access |
| `postgres-local` | Local PostgreSQL access |
| `bullmq-prod` | BullMQ job queue management |
| `mercury-banking` | Mercury banking API |

### Commands (1)
- `generate-tests` - Generate test files for code

## Manual Installation

If you prefer to install components individually:

### Skills
```bash
cp -r skills/* ~/.claude/skills/
```

### Agents
```bash
cp agents/*.md ~/.claude/agents/
```

### Commands
```bash
cp commands/*.md ~/.claude/commands/
```

### MCP Configuration
```bash
cp config/mcp.json ~/.claude/mcp.json
```

### Settings
```bash
# Review and merge with your existing settings
cat config/settings.json
```

## Configuration Files

### `config/settings.json`
Main Claude Code settings including enabled plugins and thinking mode.

### `config/settings.local.json`
Local permission rules for auto-approved tools (git, python, etc.)

### `config/mcp.json`
Claude MCP server configuration (copy to ~/.claude/mcp.json).

### `config/claude-mcp.json`
Alternative MCP configuration format.

## Customization

### Add Your Own Skills
Create a directory in `skills/` with a `skill.md` file:

```markdown
---
name: my-skill
description: "Description of what this skill does"
---

Your skill instructions here...
```

### Add Your Own Agents
Create a `.md` file in `agents/`:

```markdown
---
name: my-agent
description: "When to use this agent..."
color: blue
---

You are a specialist in...
```

## Pre-requisites

- [Claude Code](https://claude.ai/code) installed
- Node.js (for MCP servers)
- Python with uv (for custom MCP servers)
- Git

## Settings

Default configuration uses:
- **Model**: Opus (claude-opus-4-5)
- **Always Thinking**: Enabled
- **Permission Mode**: Default

## License

MIT

## Contributing

Feel free to submit PRs for new skills, agents, or improvements!
