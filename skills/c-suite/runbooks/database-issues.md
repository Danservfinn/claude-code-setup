# Runbook: Database Connection Issues

## Symptoms
- API requests returning 500 errors
- Logs showing "Connection refused" or "Connection timeout"
- Prisma errors: "Can't reach database server"
- Health endpoint reporting "unhealthy"

## Severity
**Critical** - Application cannot function without database

## Diagnostic Steps

### 1. Check Health Endpoint
```bash
# Via Bash or Railway:
curl -s http://localhost:3000/api/health | jq

# Look for database status in response
```

### 2. Check Database Connectivity
```bash
# Via PostgreSQL MCP: Run simple query
SELECT 1;

# If this fails, database is unreachable
```

### 3. Check Connection Pool
```sql
-- Via PostgreSQL MCP:
SELECT count(*) FROM pg_stat_activity WHERE datname = 'trewth';

-- If near max_connections (usually 100), pool exhausted
```

### 4. Check Railway Database Status
```bash
# Via Railway MCP: Check service status
# Look for database service health
```

## Recovery Steps

### If Connection Refused
1. **Check Railway dashboard** for database service status
2. If database down, wait for Railway auto-recovery
3. If persists > 5 minutes, check Railway status page

### If Connection Pool Exhausted
1. **Identify cause**: Too many concurrent requests or connection leaks
2. **Quick fix**: Restart the Next.js service to reset connections
3. **Long-term fix**: Review Prisma connection settings

```typescript
// In prisma/schema.prisma, check connection settings:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection limit if not present
}
```

### If Slow Queries Causing Timeouts
```sql
-- Via PostgreSQL MCP: Find slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

-- Kill long-running query if needed (with CTO approval):
-- SELECT pg_cancel_backend(pid);
```

## Common Prisma Errors

### "Connection timed out"
- Network issue between Railway services
- Restart Next.js service

### "Too many connections"
- Increase pool size or restart service
- Check for connection leaks in code

### "Prepared statement already exists"
- Prisma client not properly reusing connections
- Check singleton pattern in `/src/lib/prisma.ts`

## Prevention
- Monitor connection count regularly
- Use connection pooling (Prisma default)
- Set appropriate timeouts in DATABASE_URL
- Regular health checks

## Escalation
- **To CTO**: Immediately for any database connectivity issue
- **To Danny**: If database down > 5 minutes
