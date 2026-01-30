# Runbook: Failed Analysis Jobs

## Symptoms
- Users reporting analysis failures
- Jobs in "failed" state in queue
- Credits being refunded automatically
- Error messages in analysis results

## Severity
**Medium** - Individual users affected, credits auto-refunded

## Diagnostic Steps

### 1. Check Failed Job Count
```bash
# Via BullMQ MCP: Get queue counts
# Look at failed count

# Get details of recent failures
# Via BullMQ MCP: Get failed jobs with error messages
```

### 2. Identify Error Pattern
Common failure categories:
- **LLM errors**: Provider timeout, rate limit, invalid response
- **Extraction errors**: URL unreachable, content parsing failed
- **Database errors**: Save failed, credit deduction failed
- **Timeout errors**: Analysis took too long

### 3. Check Recent Logs
```bash
# Via Railway MCP: Search for errors
# Look for: "failed", "error", "timeout"
```

## Recovery Steps

### For LLM Provider Errors
1. Check provider health (Z.ai, OpenRouter)
2. If provider issue, jobs will auto-retry
3. See `rate-limit-recovery.md` if rate limited

### For URL/Extraction Errors
Common causes:
- **Paywall**: Site blocks automated access
- **Timeout**: Site too slow
- **Invalid content**: Not an article page

```typescript
// These usually can't be retried successfully
// User should try a different URL
// May need to add site to blocklist if persistent
```

### For Database Errors
1. Check database connectivity (see `database-issues.md`)
2. If transient, retry the job
3. Check Transaction table for credit consistency

### For Timeout Errors
1. Check if analysis is timing out consistently
2. May need to increase timeout in worker config
3. Check if specific agent is slow

## Bulk Retry Failed Jobs
```bash
# Via BullMQ MCP or code:
# Only retry if root cause is fixed

# Retry all failed jobs
# Jobs will be re-added to queue
```

## Credit Handling
- Failed jobs automatically trigger credit refund
- Check `Transaction` table for:
  - Type: RESERVE (initial)
  - Type: REFUND (on failure)
- User's balance should be restored

## Prevent Future Failures

### For Site-Specific Issues
```typescript
// Add problematic sites to extraction blocklist
// In src/agents/extraction-agent.ts or config
```

### For Timeout Issues
```typescript
// In src/lib/worker.ts, adjust timeout:
const JOB_TIMEOUT = 180000; // 3 minutes
```

### For Provider Issues
- Ensure OpenRouter fallback is configured
- Monitor provider health proactively

## User Communication
If user reports failure:
1. Verify credits were refunded
2. Explain likely cause (if known)
3. Suggest trying different URL if extraction issue

## Escalation
- **To CTO**: If failure rate > 10% of jobs
- **To Danny**: If paying user complains about repeated failures
