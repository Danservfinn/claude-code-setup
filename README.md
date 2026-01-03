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

### Plugins (5)
| Plugin | Source | Description |
|--------|--------|-------------|
| `claude-mem` | thedotmack | Memory and context management |
| `code-review` | claude-plugins-official | Automated code review |
| `ai-ml-toolkit` | claude-code-templates | AI/ML specialized agents |
| `hookify` | claude-plugins-official | Hook creation and management |
| `gastown` | n-skills | Additional skills pack |

### Skills (44)
Specialized capabilities including:
- **Development**: senior-frontend, senior-backend, senior-fullstack, senior-devops
- **AI/ML**: senior-ml-engineer, senior-data-scientist, senior-computer-vision, senior-data-engineer
- **Architecture**: senior-architect, cto-advisor, product-strategist
- **Quality**: code-reviewer, systematic-debugging, verification-before-completion
- **Workflow**: ship-it, brainstorming, writing-plans, executing-plans
- **Design**: frontend-design, ux-researcher-designer, ui-design-system, theme-factory
- And many more...

### Agents (15)
Expert agents for specific domains:
- `agent-expert` - Create specialized Claude Code agents
- `architect-review` - Architecture review
- `data-scientist` - Data analysis and modeling
- `documentation-expert` - Technical documentation
- `frontend-developer` - React and frontend development
- `nextjs-architecture-expert` - Next.js optimization
- `python-pro` - Python expertise
- `security-auditor` - Security review
- And more...

### MCP Servers (4)
| Server | Purpose |
|--------|---------|
| `shadcn` | UI component integration |
| `fetch` | Web fetching capabilities |
| `browsermcp` | Browser automation |
| `chrome-devtools` | Chrome DevTools integration |

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
cp config/mcp.json ~/.mcp.json
cp config/claude-mcp.json ~/.claude/mcp.json
```

### Settings
```bash
# Merge with your existing settings
cat config/settings.json
```

## Configuration Files

### `config/settings.json`
Main Claude Code settings including enabled plugins and thinking mode.

### `config/settings.local.json`
Local permission rules for auto-approved tools (git, python, etc.)

### `config/mcp.json`
Global MCP server configuration.

### `config/claude-mcp.json`
Claude-specific MCP server configuration.

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
- Git

## License

MIT

## Contributing

Feel free to submit PRs for new skills, agents, or improvements!
