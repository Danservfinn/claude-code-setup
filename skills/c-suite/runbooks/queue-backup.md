# Runbook: Queue Backup / Jobs Not Processing

## Symptoms
- Queue depth (waiting jobs) is growing
- No jobs in "active" state
- Users reporting long wait times
- Worker appears idle

## Severity
**High** - Directly impacts user experience

## Diagnostic Steps

### 1. Check Worker State
```bash
# Via BullMQ MCP: Check queue counts
# Expected: waiting > 0, active = 0 indicates worker not processing

# Via Railway MCP: Check if worker process is running
# Search logs for "worker" or "processing"
```

### 2. Check Redis Connectivity
```bash
# Via Redis/BullMQ MCP: Verify connection
# If connection fails, this is the root cause

# Check environment
grep "REDIS_URL" /Users/kurultai/Eris/Parse/.env
```

### 3. Check for Stuck Jobs
```bash
# Via BullMQ MCP: Get job details
# Look for jobs stuck in "active" state for > 5 minutes
# These are likely zombie jobs from crashed workers
```

## Recovery Steps

### If Worker Crashed
1. **Via Railway**: Restart the service
2. Monitor logs for successful startup
3. Verify jobs start processing

### If Redis Disconnected
1. Check Redis service status (Railway dashboard)
2. If Redis down, system falls back to in-memory queue
3. Restart service to re-establish connection

### If Jobs Stuck in "Active"
```bash
# Via BullMQ MCP: Move stuck jobs back to waiting
# These jobs had their worker die mid-processing

# Jobs will be retried automatically
# Credits were reserved but not confirmed - will timeout and refund
```

### If Rate Limited (See rate-limit-recovery.md)
Worker may be paused due to rate limits - follow that runbook.

## Quick Fixes

### Clear Stale Jobs
```typescript
// Via BullMQ MCP or direct code:
// Clean jobs older than 1 hour in completed/failed state
await queue.clean(3600000, 100, 'completed');
await queue.clean(3600000, 100, 'failed');
```

### Retry Failed Jobs
```typescript
// Via BullMQ MCP:
// Retry all failed jobs
const failed = await queue.getFailed();
for (const job of failed) {
  await job.retry();
}
```

## Prevention
- Monitor queue depth regularly
- Set up alerts for queue depth > 20
- Ensure Redis has sufficient resources

## Escalation
- **To CTO**: If queue depth > 30 jobs
- **To Danny**: If paying users affected for > 10 minutes
