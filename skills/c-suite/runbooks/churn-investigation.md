# Runbook: Churn Investigation

## Symptoms
- Elevated churn rate detected
- Multiple subscription cancellations
- Sudden drop in active users
- Negative MRR growth

## Severity
**High** - Revenue impact, may indicate systematic issue

## Diagnostic Steps

### 1. Quantify the Churn
```sql
-- Via PostgreSQL MCP:
-- Churned subscriptions in last 7 days
SELECT
  "tierId",
  COUNT(*) as churned_count,
  DATE_TRUNC('day', "updatedAt") as churn_date
FROM "Subscription"
WHERE status IN ('canceled', 'unpaid')
  AND "updatedAt" >= NOW() - INTERVAL '7 days'
GROUP BY "tierId", DATE_TRUNC('day', "updatedAt")
ORDER BY churn_date DESC;
```

### 2. Identify Churned Users
```sql
-- Get details on churned users
SELECT
  u.email,
  s."tierId",
  s."createdAt" as subscription_start,
  s."updatedAt" as churn_date,
  u."lifetimeCredits",
  u."lifetimeSpent",
  (SELECT COUNT(*) FROM "Analysis" a WHERE a."userId" = u.id) as total_analyses
FROM "Subscription" s
JOIN "User" u ON s."userId" = u.id
WHERE s.status IN ('canceled', 'unpaid')
  AND s."updatedAt" >= NOW() - INTERVAL '7 days'
ORDER BY s."updatedAt" DESC;
```

### 3. Analyze Usage Patterns
```sql
-- Were churned users active?
SELECT
  u.email,
  COUNT(a.id) as analyses_last_30d,
  MAX(a."createdAt") as last_analysis
FROM "User" u
JOIN "Subscription" s ON s."userId" = u.id
LEFT JOIN "Analysis" a ON a."userId" = u.id
  AND a."createdAt" >= NOW() - INTERVAL '30 days'
WHERE s.status IN ('canceled', 'unpaid')
  AND s."updatedAt" >= NOW() - INTERVAL '7 days'
GROUP BY u.id, u.email;
```

## Common Churn Patterns

### Credit Exhaustion Churn
**Pattern**: Pro users hitting credit limits
**Signal**: High overflow purchases before cancel
**Action**: Review upgrade messaging, consider tier changes

### Low Usage Churn
**Pattern**: Users not engaging with product
**Signal**: < 3 analyses per month
**Action**: Improve onboarding, add engagement triggers

### Service Issue Churn
**Pattern**: Churn correlates with technical issues
**Signal**: Check CTO alerts for same timeframe
**Action**: Coordinate with CTO on service reliability

### Price Sensitivity Churn
**Pattern**: Cancel at renewal
**Signal**: Long tenure, price complaints
**Action**: Consider retention offers or annual discounts

## Investigation Workflow

### 1. Correlate with Technical Issues
```bash
# Check CTO Activity Dashboard for same timeframe
# Look for: deployment failures, outages, performance issues
```

### 2. Check Credit Patterns
```sql
-- Were users running out of credits?
SELECT
  u.email,
  c.balance,
  (SELECT COUNT(*) FROM "Transaction" t
   WHERE t."userId" = u.id AND t.type = 'OVERFLOW_PURCHASE'
   AND t."createdAt" >= NOW() - INTERVAL '30 days') as overflow_purchases
FROM "User" u
JOIN "Credits" c ON c."userId" = u.id
JOIN "Subscription" s ON s."userId" = u.id
WHERE s.status IN ('canceled', 'unpaid')
  AND s."updatedAt" >= NOW() - INTERVAL '7 days';
```

### 3. Calculate Revenue Impact
```sql
-- MRR lost this period
SELECT
  SUM(CASE
    WHEN "tierId" = 'tier_pro' THEN 9
    WHEN "tierId" = 'tier_max' THEN 69
    ELSE 0
  END) as mrr_lost
FROM "Subscription"
WHERE status IN ('canceled', 'unpaid')
  AND "updatedAt" >= NOW() - INTERVAL '7 days';
```

## Response Actions

### Immediate
1. Quantify: How many users, which tiers, MRR impact
2. Categorize: Usage pattern, tenure, recent activity
3. Correlate: Any service issues in same timeframe?

### Short-term
1. Reach out to high-value churned users
2. Analyze feedback if provided
3. Fix any identified service issues

### Long-term
1. Update churn prediction models
2. Implement proactive retention triggers
3. Review pricing and tier structure

## Reporting

### For Danny
```markdown
## Churn Alert: {date}

**Summary**: {X} users churned, ${Y} MRR lost

**Breakdown**:
- Pro: {count} users (${mrr})
- Max: {count} users (${mrr})

**Primary Cause**: {identified pattern}

**Correlated Issues**: {technical issues if any}

**Recommended Actions**:
1. {action 1}
2. {action 2}
```

## Escalation
- **To CEO**: When churn rate exceeds 5% monthly
- **To CTO**: When churn correlates with service issues
- **To Danny**: Any churn > 3 users in 24 hours
