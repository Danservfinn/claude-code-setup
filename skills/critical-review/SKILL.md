---
name: critical-review
description: This skill performs comprehensive multi-disciplinary critical reviews of designs, plans, and technical artifacts by analyzing from multiple expert perspectives: UX, backend, frontend, architecture, data science, data engineering, fullstack, prompt engineering, and DevOps. Use this skill when the user asks to "critically review," "critique," "evaluate," or perform "adversarial analysis" of web pages, features, systems, architectures, or any design/document. The skill synthesizes findings into a consolidated report and presents suggested improvements for batch approval.
integrations:
  - dispatching-parallel-agents
  - subagent-driven-development
  - code-reviewer
  - accessibility-auditor
  - senior-architect
  - senior-backend
---

# Critical Review

Perform comprehensive multi-disciplinary reviews by dispatching specialized parallel agents across UX, backend, frontend, architecture, data, and DevOps domains. This skill delegates to expert agents for each domain, synthesizes findings into a consolidated report, and provides an automatic implementation pathway for approved improvements.

## When to Use This Skill

Invoke this skill when:
- The user explicitly requests a "critical review," "critique," "evaluation," or "adversarial analysis" of any artifact
- A design document, API specification, system architecture, or feature plan requires comprehensive expert validation
- There's a need to identify weaknesses, risks, and improvement opportunities across multiple technical domains
- The user wants adversarial or skeptical analysis to stress-test proposals before implementation

**Note:** For focused adversarial analysis of web pages with data/ML claims, use the `critical-reviewer` skill instead.

## Review Workflow

### Phase 1: Context Gathering

Before conducting the review, establish context:

1. **Identify the artifact under review** - This may be:
   - A web page or URL (use browser automation tools to capture if needed)
   - A design document or specification file (read the file)
   - Code repository or architecture diagram
   - Feature plan or PRD
   - Database schema or API contract

2. **Gather existing context** - Leverage available context sources:
   - **Current conversation** - Review any prior discussion about the artifact
   - **Claude memory** - Use the 3-layer MCP search workflow:
     1. `mcp__plugin_claude-mem_mcp-search__search` - Search for project/feature keywords to get observation IDs
     2. `mcp__plugin_claude-mem_mcp-search__timeline` - Get context around interesting observations
     3. `mcp__plugin_claude-mem_mcp-search__get_observations` - Fetch full details only for filtered IDs
   - **Project documentation** - ARCHITECTURE.md, design docs, prior reviews

3. **Establish review scope** - Determine which domains are relevant:
   - **All domains** for full system reviews, major features, or end-to-end architectures
   - **Subset of domains** for focused reviews (e.g., only backend + DevOps for API changes)

### Phase 2: Conduct Multi-Domain Analysis (Parallel Agent Dispatch)

Analyze the artifact by dispatching specialized agents in parallel for each relevant domain.

**Domain-to-Agent Mapping:**

| Domain | Agent Type | Expertise |
|--------|------------|-----------|
| UX & Accessibility | `accessibility-auditor` | WCAG compliance, screen reader testing, semantic HTML |
| Backend | `senior-backend` | API design, data modeling, security, performance |
| Frontend | `frontend-mobile-development:frontend-developer` | Components, state management, responsiveness |
| Architecture | `senior-architect` | System design, scalability, SOLID principles |
| Data Science | `senior-data-scientist` | Statistical validity, ML appropriateness, bias |
| Data Engineering | `senior-data-engineer` | Pipelines, schema design, data quality |
| Fullstack | `senior-fullstack` | End-to-end coherence, integration |
| Prompt Engineering | `senior-prompt-engineer` | LLM integration, RAG, prompt injection |
| DevOps | `senior-devops` | Infrastructure, CI/CD, monitoring |

**Dispatch Pattern:**

Use `dispatching-parallel-agents` pattern when multiple domains need analysis:
1. Create a single message with multiple `Task` tool calls (one per domain)
2. Each agent receives focused prompt with artifact context
3. Agents run in parallel without shared state
4. Collect and synthesize results after all complete

**Standardized Finding Format:**

Each agent returns findings in this structure:
```json
{
  "domain": "Backend",
  "findings": [
    {
      "severity": "Critical|High|Medium|Low",
      "issue": "Brief description",
      "reference": "file:line or component",
      "suggested_action": "Specific fix"
    }
  ]
}
```

### Phase 3: Synthesis and Consolidation

After completing the domain analyses, synthesize the findings:

1. **Categorize findings** by domain:
   - User Experience & Accessibility
   - Backend & API Design
   - Frontend & Implementation
   - Architecture & System Design
   - Data & Analytics
   - Infrastructure & DevOps
   - Security & Performance
   - AI/LLM Integration (if applicable)

2. **Prioritize by severity/impact:**
   - **Critical** - Security vulnerabilities, data loss risks, legal compliance issues
   - **High** - Major usability problems, performance bottlenecks, scalability risks
   - **Medium** - Code quality issues, maintainability concerns, minor UX friction
   - **Low** - Nice-to-have improvements, optimizations, style suggestions

3. **Identify cross-cutting themes** - Issues that multiple domains flagged (e.g., "scalability concerns raised by backend, architect, and DevOps")

### Phase 4: Report Presentation

Present the consolidated critical review report using the complete structure below. Fill in each section with actual findings; omit sections with no findings.

```markdown
# Critical Review Report: [Artifact Name]

## Executive Summary
[Brief overview of what was reviewed and overall assessment - 2-3 sentences]

## Findings by Domain

### User Experience & Accessibility
- [Specific finding with reference]
- [Specific finding with reference]

### Backend & API Design
- [Specific finding with reference]
- [Specific finding with reference]

### Frontend & Implementation
- [Specific finding with reference]
- [Specific finding with reference]

### Architecture & System Design
- [Specific finding with reference]
- [Specific finding with reference]

### Data & Analytics
- [Specific finding with reference]
- [Specific finding with reference]

### Infrastructure & DevOps
- [Specific finding with reference]
- [Specific finding with reference]

### Security & Performance
- [Specific finding with reference]
- [Specific finding with reference]

### AI/LLM Integration
- [Specific finding with reference]
- [Specific finding with reference]

## Cross-Cutting Concerns
[Issues flagged by multiple domains, with note of which domains raised each]

## Prioritized Improvement List

| Priority | Domain | Issue | Suggested Action |
|----------|--------|-------|------------------|
| Critical | Security | [Description] | [Action] |
| High | Performance | [Description] | [Action] |
| Medium | [Domain] | [Description] | [Action] |
| Low | [Domain] | [Description] | [Action] |
```

### Phase 5: Batch Approval Workflow

After presenting the report, facilitate batch approval:

1. **Present the approval question:**
   ```
   Which improvements would you like to approve for implementation?

   You can:
   - Specify individual items by number (e.g., "1, 3, 5")
   - Approve by priority tier (e.g., "all Critical and High")
   - Approve all items (e.g., "all")
   - Reject or defer items (e.g., "skip 4, defer 7")
   ```

2. **Record approved items** - Create a structured list

3. **Automatic execution** using `subagent-driven-development`:
   - If user approves items for immediate implementation
   - Create mini implementation plan from approved items
   - Dispatch subagent-driven-development with:
     - Approved findings as requirements
     - Artifact context as baseline
     - Suggested actions as implementation tasks
   - Each approved item becomes an independent task in the plan

4. **Alternative next steps** (if automatic execution declined):
   - Create implementation tasks/tickets
   - Delegate to appropriate specialized agents:
     - `backend-development:backend-architect` for backend/architecture issues
     - `frontend-mobile-development:frontend-developer` for frontend issues
     - `python-development:python-pro` for Python-specific work
     - `senior-devops` for infrastructure/DevOps issues

## Artifact Type Integration

Different artifact types trigger specialized analysis paths:

### Web Pages
- Use browser automation tools to capture page state
- Delegate to `accessibility-auditor` for WCAG compliance audit
- Use `mcp__claude-in-chrome__read_page` for accessibility tree analysis
- Test keyboard navigation and screen reader compatibility

### API Specifications
- Delegate to `senior-backend` for endpoint design review
- Validate REST/GraphQL best practices
- Check authentication, authorization, error handling
- Review data validation and serialization

### Architecture Documents
- Delegate to `senior-architect` for diagram validation
- Analyze system boundaries and coupling
- Evaluate scalability and maintainability
- Review integration patterns and technical debt

### Code Repositories
- Delegate to `code-reviewer` for comprehensive code analysis
- Review pull request diff with BASE_SHA/HEAD_SHA
- Check for security vulnerabilities and best practices
- Validate test coverage and quality

### Database Schemas
- Delegate to `senior-data-engineer` for schema review
- Validate normalization and indexing
- Check data quality constraints
- Review migration strategy

## Review Quality Standards

Ensure all reviews meet these standards:

- **Specific** - Point to exact files, lines, or components, not vague concerns
- **Actionable** - Each issue includes a concrete improvement suggestion
- **Evidence-based** - Ground critiques in analysis, not opinion
- **Constructive** - Frame issues as improvement opportunities
- **Context-aware** - Consider constraints, timelines, and trade-offs

## Adversarial Analysis Mode

When explicit adversarial analysis is requested:

- Challenge assumptions in the design
- Look for failure modes and edge cases
- Question whether the solution actually solves the stated problem
- Identify where the design could break under stress
- Flag where human error could cause problems
- Consider malicious or misuse scenarios

## Exit Conditions

Complete the review when:
- All relevant domains have been analyzed
- Findings are synthesized into a consolidated report
- The user has reviewed and approved/rejected improvement suggestions
- Next steps are clear
