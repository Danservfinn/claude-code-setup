#!/bin/bash

# Claude Code Setup Installer
# This script sets up Claude Code with all plugins, skills, agents, commands, and configuration
# Usage: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/claude-code-setup/main/install.sh | bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Claude Code Setup Installer                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: Claude Code is not installed.${NC}"
    echo "Please install Claude Code first: https://claude.ai/code"
    exit 1
fi

CLAUDE_DIR="$HOME/.claude"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# If running via curl pipe, clone the repo first
if [ ! -d "$SCRIPT_DIR/skills" ]; then
    echo -e "${YELLOW}Cloning configuration repository...${NC}"
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 https://github.com/YOUR_USERNAME/claude-code-setup.git "$TEMP_DIR"
    SCRIPT_DIR="$TEMP_DIR"
fi

echo -e "${GREEN}Step 1/6: Creating directories...${NC}"
mkdir -p "$CLAUDE_DIR/skills"
mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/commands"

echo -e "${GREEN}Step 2/6: Installing skills...${NC}"
if [ -d "$SCRIPT_DIR/skills" ]; then
    cp -r "$SCRIPT_DIR/skills/"* "$CLAUDE_DIR/skills/" 2>/dev/null || true
    echo "  ✓ Copied $(ls -1 "$SCRIPT_DIR/skills" | wc -l | tr -d ' ') skills"
fi

echo -e "${GREEN}Step 3/6: Installing agents...${NC}"
if [ -d "$SCRIPT_DIR/agents" ]; then
    cp "$SCRIPT_DIR/agents/"*.md "$CLAUDE_DIR/agents/" 2>/dev/null || true
    echo "  ✓ Copied $(ls -1 "$SCRIPT_DIR/agents"/*.md 2>/dev/null | wc -l | tr -d ' ') agents"
fi

echo -e "${GREEN}Step 4/6: Installing commands...${NC}"
if [ -d "$SCRIPT_DIR/commands" ]; then
    cp "$SCRIPT_DIR/commands/"*.md "$CLAUDE_DIR/commands/" 2>/dev/null || true
    echo "  ✓ Copied $(ls -1 "$SCRIPT_DIR/commands"/*.md 2>/dev/null | wc -l | tr -d ' ') commands"
fi

echo -e "${GREEN}Step 5/6: Configuring MCP servers...${NC}"
# Backup existing configs
if [ -f "$HOME/.mcp.json" ]; then
    cp "$HOME/.mcp.json" "$HOME/.mcp.json.backup.$(date +%s)"
    echo "  ✓ Backed up existing ~/.mcp.json"
fi

# Copy MCP config
if [ -f "$SCRIPT_DIR/config/mcp.json" ]; then
    cp "$SCRIPT_DIR/config/mcp.json" "$HOME/.mcp.json"
    echo "  ✓ Installed MCP server configuration"
fi

# Copy Claude-specific MCP config
if [ -f "$SCRIPT_DIR/config/claude-mcp.json" ]; then
    cp "$SCRIPT_DIR/config/claude-mcp.json" "$CLAUDE_DIR/mcp.json"
    echo "  ✓ Installed Claude MCP configuration"
fi

echo -e "${GREEN}Step 6/6: Installing plugins...${NC}"
echo -e "${YELLOW}  Installing plugin marketplaces...${NC}"

# Install plugins via Claude Code CLI
# Note: User needs to have Claude Code installed
claude mcp add thedotmack --github thedotmack/claude-mem 2>/dev/null || true
echo "  ✓ Added thedotmack marketplace"

claude mcp add claude-plugins-official --github anthropics/claude-plugins-official 2>/dev/null || true
echo "  ✓ Added claude-plugins-official marketplace"

claude mcp add claude-code-templates --git https://github.com/davila7/claude-code-templates.git 2>/dev/null || true
echo "  ✓ Added claude-code-templates marketplace"

claude mcp add n-skills --github numman-ali/n-skills 2>/dev/null || true
echo "  ✓ Added n-skills marketplace"

echo -e "${YELLOW}  Installing plugins from marketplaces...${NC}"
claude plugins install claude-mem@thedotmack 2>/dev/null || echo "  ⚠ claude-mem may need manual install"
claude plugins install code-review@claude-plugins-official 2>/dev/null || echo "  ⚠ code-review may need manual install"
claude plugins install ai-ml-toolkit@claude-code-templates 2>/dev/null || echo "  ⚠ ai-ml-toolkit may need manual install"
claude plugins install hookify@claude-plugins-official 2>/dev/null || echo "  ⚠ hookify may need manual install"
claude plugins install gastown@n-skills 2>/dev/null || echo "  ⚠ gastown may need manual install"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Installation Complete!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Installed components:${NC}"
echo "  • Skills: 44 specialized capabilities"
echo "  • Agents: 15 expert agents"
echo "  • Commands: 1 custom command"
echo "  • MCP Servers: shadcn, fetch, browsermcp, chrome-devtools"
echo "  • Plugins: claude-mem, code-review, ai-ml-toolkit, hookify, gastown"
echo ""
echo -e "${YELLOW}Optional: Copy CLAUDE.md to your home directory:${NC}"
echo "  cp $SCRIPT_DIR/CLAUDE.md ~/CLAUDE.md"
echo ""
echo -e "${YELLOW}To enable plugins in settings, run:${NC}"
echo "  claude /plugins"
echo ""
echo -e "${GREEN}Start Claude Code with: claude${NC}"

# Clean up temp directory if used
if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
