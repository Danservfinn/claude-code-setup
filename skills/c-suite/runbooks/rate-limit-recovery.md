# Runbook: Z.ai Rate Limit Recovery

## Symptoms
- Analysis jobs are not completing
- Logs show "429 Too Many Requests" errors from Z.ai
- Worker is paused
- Queue depth is growing

## Severity
**Medium** - Users experience delays but no data loss

## Automated Response (Worker handles this)
The worker automatically:
1. Detects 429 responses
2. Pauses processing
3. Waits for `RATE_LIMIT_PAUSE_MS` (default 60s)
4. Retries with exponential backoff
5. Resumes when rate limit clears

## Manual Intervention Required When
- Worker hasn't resumed after 5+ minutes
- OpenRouter fallback is also failing
- Queue depth exceeds 50 jobs

## Recovery Steps

### 1. Check Current State
```bash
# Via BullMQ MCP: Get queue counts
# Look for: waiting > 10, active = 0

# Via Railway MCP: Check recent logs
# Search for: "rate limit" or "429"
```

### 2. Verify OpenRouter Fallback
```bash
# Check if OpenRouter is enabled
grep "ENABLE_OPENROUTER_FALLBACK" /Users/kurultai/Eris/Parse/.env

# Check for OpenRouter errors in logs
# Via Railway: search for "openrouter" errors
```

### 3. If Worker Stuck Paused

**Option A: Wait for auto-recovery** (preferred)
- Worker should auto-resume within 5 minutes
- Monitor queue depth

**Option B: Force resume** (if urgent)
```typescript
// In src/lib/worker.ts, the worker has auto-resume logic
// If stuck, may need to restart the service via Railway
```

### 4. If Both Providers Failing
- Check Z.ai status page
- Check OpenRouter status page
- Consider temporarily increasing `RATE_LIMIT_PAUSE_MS`
- Notify Danny if outage > 15 minutes

## Prevention
- Monitor API usage via provider dashboards
- Consider increasing provider slots gradually
- Implement request coalescing for duplicate analyses

## Escalation
- **To CTO**: If recovery takes > 10 minutes
- **To Danny**: If affecting paying customers for > 15 minutes
