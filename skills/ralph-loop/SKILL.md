---
name: ralph-loop
description: Use when executing Ralph Loop continuous implementation mode for Trewth platform - non-stop execution through all 13 phases
---

# Ralph Loop: Continuous Implementation Mode

## Overview

Execute complete implementation of Trewth platform WITHOUT stopping for ANY reason. Work through all 13 phases continuously from infrastructure setup to production deployment.

**Core principle:** NEVER STOP - KEEP BUILDING until fully complete.

**Announce at start:** "I'm entering Ralph Loop continuous execution mode to build Trewth."

## Mission Context

**Project:** Trewth - Hyper-critical media analysis platform

**Core Principle:** NO appeals to authority. Evaluate articles on:
- Evidence Quality (40%)
- Methodology Rigor (25%)
- Logical Structure (20%)
- Manipulation Absence (15%)

**AI Model:** Z.ai GLM-4.7 (unlimited on coding plan)

**Location:** `/Users/kurultai/Eris/trewth`

## The Process

### Step 1: Initial Setup

Execute these commands immediately:

```bash
cd /Users/kurultai/Eris/trewth

# Install all dependencies
npm install next@latest react@latest react-dom@latest
npm install @prisma/client @auth/prisma-adapter next-auth@beta
npm install bullmq ioredis zod
npm install framer-motion lucide-react recharts
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D prisma tailwindcss postcss autoprefixer eslint eslint-config-next

# Set up environment
cp .env.example .env
# Edit .env and add ZAI_API_KEY from https://open.bigmodel.cn/
# Also add DATABASE_URL, NEXTAUTH_SECRET, REDIS_URL

# Initialize database
npx prisma generate
npx prisma db push

# Start dev server (keep this running)
npm run dev
```

### Step 2: Read Prerequisite Documentation

Read these files ONCE at the start:
1. `RALPH_LOOP_IMPLEMENTATION.md` - Complete execution checklist
2. `DESIGN.md` - Full architecture specification
3. `ZAI_SETUP.md` - Z.ai GLM API setup guide
4. `src/types/index.ts` - All type definitions

**After reading, NEVER reference them again unless absolutely critical. Make your own decisions.**

### Step 3: Execute ALL Phases Continuously

Work through ALL 13 phases in order WITHOUT stopping:

1. **Phase 1: Foundation Infrastructure** (Items 1.1-1.6)
   - Already: 1.1, 1.2, 1.5, 1.6 are DONE
   - Do: 1.3 (NextAuth), 1.4 (UI components)

2. **Phase 2: Database Schema & Models**
   - Schema is complete, just verify Prisma works

3. **Phase 3: Authentication & Credits**
   - Build auth pages, credits system, dashboard

4. **Phase 4: Article Extraction**
   - Build ExtractionAgent with GLM-4.5
   - Create extraction API
   - Build article upload UI

5. **Phase 5: Analysis Agents**
   - Build ALL 5 agents (SteelManning, DeceptionDetection, FactCheck, Fallacy, ContextAudit)
   - Each uses GLM-4.7 for highest quality
   - Build SynthesisAgent to combine outputs

6. **Phase 6: Truth Quantification**
   - Implement all scorers (evidence, methodology, logic, manipulation)
   - Test scoring with examples

7. **Phase 7: Queue System**
   - Set up BullMQ + Redis
   - Configure 3 priority queues
   - Build queue status API

8. **Phase 8: Results Display**
   - Build ALL result components (TrewthCard, perspectives, deception, fallacies, etc.)
   - Create full results page

9. **Phase 9: Full Analysis Flow**
   - Create analysis API
   - Build main analysis interface
   - Implement progress streaming

10. **Phase 10: Search Provider Integration**
    - Already done (DDG + Bing)
    - Test with CriticalFactCheckAgent

11. **Phase 11: Landing Page & Marketing**
    - Landing page already exists
    - Build pricing page

12. **Phase 12: Testing & Validation**
    - Write tests for critical components
    - Test with real articles
    - Fix any issues found

13. **Phase 13: Production Readiness**
    - Deploy to Vercel
    - Set up monitoring
    - Verify everything works

### Step 4: Mark Progress

As you complete each item in `RALPH_LOOP_IMPLEMENTATION.md`, mark it as `[DONE]`.

Example:
```markdown
- [x] 1.3 Set Up NextAuth.js
- [ ] 1.4 Create Base UI Components ← Working here
- [ ] 2.1 Create Prisma Models
```

Keep a running count of completed items at the top of your responses.

## 🔄 CONTINUOUS EXECUTION MODE

**Keep building without stopping for ANY reason:**

- ✅ Make architectural decisions based on DESIGN.md
- ✅ Follow patterns from existing components
- ✅ Fix ALL TypeScript errors immediately
- ✅ Create ALL missing components (don't skip any)
- ✅ Add inline comments as you code
- ✅ Test each component as you build it
- ✅ If something is unclear, make best judgment and add comment
- ✅ Never pause, never ask, never wait - just keep building

**When you encounter an issue:**
1. Read DESIGN.md for guidance (only first time)
2. Make decision based on design principles
3. Add comment explaining your choice
4. Continue to next item immediately
5. DO NOT STOP for ANY reason

## Key Technical Decisions

### Model Selection
- **ExtractionAgent:** Use GLM-4.5 (fast, accurate)
- **All Analysis Agents:** Use GLM-4.7 (highest quality)
- **SynthesisAgent:** Use GLM-4.7 (combines all outputs)

### Component Patterns
- Use existing components from debate-analytics as reference
- Follow shadcn/ui patterns for all UI components
- Use Tailwind utility classes for styling
- Add proper TypeScript types for everything

### API Patterns
- All API routes in `src/app/api/`
- Use Prisma for database operations
- Handle errors with try/catch
- Return JSON responses with proper status codes

### Database
- Use Prisma client from `@prisma/client`
- All queries use Prisma methods
- Transactions for multi-step operations

### Search
- Use `searchManager` from `src/lib/search/index.ts`
- DuckDuckGo is primary, Bing is fallback
- Both already configured and ready

## Common Patterns to Follow

### Creating an Agent
```typescript
// src/agents/your-agent.ts
import { callGLM } from '@/lib/zai';
import type { Article, YourResult } from '@/types';

export async function yourAgent(article: Article): Promise<YourResult> {
  const systemPrompt = `You are an expert at...`;

  const result = await callGLM({
    prompt: `Analyze this article:\n\n${JSON.stringify(article)}`,
    systemPrompt,
    model: 'glm-4.7',
    maxTokens: 2000,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  const data = extractJSON(result.text);
  return data;
}
```

### Creating an API Route
```typescript
// src/app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Creating a Component
```typescript
// src/components/your-component.tsx
'use client';

import { cn } from '@/lib/utils';

interface YourComponentProps {
  data: SomeType;
  className?: string;
}

export function YourComponent({ data, className }: YourComponentProps) {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      {/* Your component content */}
    </div>
  );
}
```

## Verification Checkpoints

Run these quick verifications after each phase (but don't stop):

**After Phase 1:**
```bash
# TypeScript compiles
npx tsc --noEmit
# Dev server runs
npm run dev
# UI components render
# Visit http://localhost:3000
```

**After Phase 3:**
```bash
# Can sign up
# Can sign in
# Credits display correctly
# Dashboard loads
```

**After Phase 5:**
```bash
# All agents import correctly
# Each agent has test
# Agents can run in parallel
# SynthesisAgent combines outputs
```

**After Phase 8:**
```bash
# Can analyze article end-to-end
# Truth score calculated
# All result components render
# Results page works
```

**Final Verification:**
```bash
# Full user flow works:
# 1. Sign up → Get credits
# 2. Submit article URL
# 3. Preview extracted content
# 4. Run full analysis
# 5. See truth score + breakdown
# 6. View steel-manned perspectives
# 7. See deception detection
# 8. Read "What AI Thinks"
# 9. Share results
```

## Final State

When you're done, ALL of these should be working:

✅ User can sign up with email/password
✅ User gets 25 free credits on signup
✅ User can submit article URL
✅ System extracts article content (claims, sources, statistics)
✅ User can preview and confirm extraction
✅ User can run free analysis (1/day) or full analysis (20 credits)
✅ System runs all 5 agents in parallel
✅ Steel-manned perspectives generated (3-4 viewpoints)
✅ Deception techniques detected and flagged
✅ Logical fallacies identified
✅ Fact-checking with independent research
✅ Truth score calculated (0-100) with full breakdown
✅ "What AI Thinks" section generated
✅ User sees shareable analysis card
✅ All results components display correctly
✅ Queue system handles multiple users
✅ Priority queues work (Pro > Pay > Free)
✅ Everything is production-ready

## Critical Rules

1. **DO NOT STOP** for ANY reason
2. **DO NOT ASK** for clarification - make best judgment
3. **DO NOT WAIT** for feedback - keep building
4. **DO NOT SKIP** any components or features
5. **DO NOT PAUSE** at checkpoints - verify and continue
6. **MAKE ALL DECISIONS** autonomously based on DESIGN.md
7. **FIX ALL ERRORS** immediately before proceeding
8. **TEST EVERYTHING** as you build it

## Remember

- This is continuous execution mode - NO stopping
- Make all architectural decisions yourself
- Follow DESIGN.md as your reference
- Use existing debate-analytics components as patterns
- Keep building until everything works
- When done, announce completion and show all features working

The only acceptable outcome is a fully functional, production-ready Trewth platform.
