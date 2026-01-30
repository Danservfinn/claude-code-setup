# Runbook: Payment Failures

## Symptoms
- Stripe webhook events failing
- Users reporting subscription issues
- Credits not being allocated after payment
- Failed charges in Stripe dashboard

## Severity
**High** - Directly impacts revenue and customer experience

## Diagnostic Steps

### 1. Check Webhook Delivery
```bash
# Go to Stripe Dashboard > Developers > Webhooks
# Check the webhook endpoint: https://parsethe.media/api/stripe/webhook
# Look for failed deliveries
```

### 2. Check Railway Logs
```bash
# Via Railway MCP: Search for webhook errors
# Search for: "stripe", "webhook", "payment"
```

### 3. Verify Environment Variables
```bash
# Check these are set in Railway:
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
```

## Common Failure Patterns

### Webhook Signature Verification Failed
**Cause**: STRIPE_WEBHOOK_SECRET mismatch
**Fix**:
1. Get the correct secret from Stripe Dashboard > Webhooks
2. Update STRIPE_WEBHOOK_SECRET in Railway

### Subscription Created but Credits Not Added
**Cause**: Database transaction failed
**Fix**:
1. Check Transaction table for the Stripe event
2. Manually add credits if needed
3. Investigate database issues (see database-issues.md)

### Checkout Session Completed but No Subscription
**Cause**: checkout.session.completed handler failed
**Fix**:
1. Check logs for the specific session ID
2. Manually create subscription record
3. Ensure credits are allocated

## Recovery Steps

### 1. Verify Payment in Stripe
```bash
# Go to Stripe Dashboard > Payments
# Find the specific payment
# Note: customer ID, amount, status
```

### 2. Check Parse Database
```sql
-- Via PostgreSQL MCP:
SELECT * FROM "Subscription"
WHERE "stripeCustomerId" = 'cus_xxx';

SELECT * FROM "Transaction"
WHERE "stripeSessionId" = 'cs_xxx';
```

### 3. Manual Credit Allocation
If payment confirmed but credits missing:
```sql
-- Via PostgreSQL MCP:
-- First check current balance
SELECT * FROM "Credits" WHERE "userId" = 'xxx';

-- Add credits manually (requires CTO approval)
-- Document in AdminAction table
```

### 4. Replay Webhook Event
```bash
# From Stripe Dashboard > Webhooks > Failed Events
# Click "Resend" to replay the event
# Monitor logs for processing
```

## Prevention
- Monitor webhook success rate in Stripe Dashboard
- Set up Stripe webhook alerts
- Test webhook handling in staging environment
- Ensure idempotent webhook handlers

## Escalation
- **To CTO**: Any payment processing issue
- **To CFO**: Revenue impact assessment
- **To Danny**: Customer complaints about billing
