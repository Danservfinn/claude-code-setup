# Payment Integration Reference

Kurultai LLC payment infrastructure using Stripe and Mercury for Parse SaaS platform.

## Quick Reference

| Service | Purpose | Status |
|---------|---------|--------|
| Stripe | Payment processing | ✅ Active |
| Mercury | Business banking | ✅ Active |
| Stripe→Mercury | Payout automation | ✅ Linked |

---

## Stripe Configuration

### Account Details

```
Account ID: acct_1Snq0B8LghiREdMS
Dashboard: https://dashboard.stripe.com/acct_1Snq0B8LghiREdMS
Business Type: LLC
Legal Name: Kurultai Limited Liability Company
EIN: 81-4498251
Address: 319 W Lenoir St Apt 1409, Raleigh, NC 27601
```

### Products and Prices

| Product | Price ID | Amount | Billing | Credits |
|---------|----------|--------|---------|---------|
| Pro Monthly | price_1SrWHX8LghiREdMSL26rdsSH | $9.00 | Monthly | 100 |
| Pro Annual | price_1SrWHY8LghiREdMSyEyzq1j3 | $90.00 | Yearly | 100 |
| Max Monthly | price_1SrWHY8LghiREdMSN6D82M6g | $69.00 | Monthly | 1000 |
| Max Annual | price_1SrWHY8LghiREdMSEJVUeHU7 | $690.00 | Yearly | 1000 |
| Starter Pack | price_1SrWHZ8LghiREdMS0bq7hsI7 | $4.99 | One-time | 10 |
| Growth Pack | price_1SrWHa8LghiREdMSjBnAWps3 | $12.99 | One-time | 30 |
| Power Pack | price_1SrWHa8LghiREdMSGCDAl5t3 | $34.99 | One-time | 100 |

### Environment Variables (Railway)

```bash
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
STRIPE_PRICE_TIER_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_PRICE_TIER_PRO_ANNUAL=price_YOUR_PRO_ANNUAL_PRICE_ID
STRIPE_PRICE_TIER_MAX=price_YOUR_MAX_PRICE_ID
STRIPE_PRICE_TIER_MAX_ANNUAL=price_YOUR_MAX_ANNUAL_PRICE_ID
STRIPE_PRICE_PACK_STARTER=price_YOUR_STARTER_PACK_ID
STRIPE_PRICE_PACK_GROWTH=price_YOUR_GROWTH_PACK_ID
STRIPE_PRICE_PACK_POWER=price_YOUR_POWER_PACK_ID
```

### Webhook Configuration

```
URL: https://parsethe.media/api/stripe/webhook
ID: we_1SrWHt8LghiREdMSqNBTZLmn
Events:
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.paid
  - invoice.payment_failed
```

---

## Mercury Configuration

### Account Details

```
Routing Number: 121145433
Account Number: 474816468300230
Account Holder: Kurultai Limited Liability Company
Account Type: Business Checking
Dashboard: https://mercury.com
```

### Stripe Payout Configuration

```
Bank Account Status: Linked
Payout Schedule: Configure in Stripe Settings → Payouts
Minimum Payout: $50 (recommended)
Verification: Micro-deposits pending (1-2 business days)
```

---

## Parse Integration Code

### Key Files

```
/Users/kurultai/Eris/Parse/
├── src/lib/stripe.ts                    # Stripe client and utilities
├── src/app/api/stripe/
│   ├── webhook/route.ts                 # Webhook handlers
│   ├── checkout/subscription/route.ts   # Subscription checkout
│   └── checkout/pack/route.ts           # Credit pack checkout
├── scripts/
│   ├── setup-stripe-products.ts         # Create products/prices
│   ├── create-webhook.js                # Configure webhooks
│   └── link-mercury-account.ts          # Link Mercury bank
└── docs/STRIPE_SETUP.md                 # Full setup guide
```

### Database Schema

```
User
├── stripeCustomerId (string)
└── subscriptions (Subscription[])
    ├── stripeSubscriptionId
    ├── stripePriceId
    ├── tierId
    ├── status
    └── analysesPerMonth

Transaction
├── type (CREDIT_PURCHASE, SUBSCRIPTION_RENEWAL, etc.)
├── amount (decimal)
├── metadata (jsonb)
│   ├── stripeEventId
│   ├── stripeSessionId
│   └── ...

Credits
├── balance (int)
├── lifetimeCredits (int)
└── lifetimeSpent (int)
```

---

## Common Operations

### Create a New Product

```bash
cd /Users/kurultai/Eris/Parse
STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/setup-stripe-products.ts
```

### Test Webhook Delivery

```bash
# Check webhook logs
railway logs

# Test webhook endpoint
curl -X POST https://parsethe.media/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### View Stripe Balance

```bash
# Via Stripe CLI
stripe balance

# Or visit Dashboard
https://dashboard.stripe.com/acct_1Snq0B8LghiREdMS/balance/overview
```

### Initiate Stripe Payout

```bash
# Via Stripe CLI
stripe payout create --amount=1000 --currency=usd

# Or via Dashboard
Settings → Payouts → Request payout
```

---

## Troubleshooting

### Webhook Not Receiving Events

1. Verify webhook URL is accessible:
   ```bash
   curl https://parsethe.media/api/stripe/webhook
   ```

2. Check Railway logs:
   ```bash
   railway logs --api
   ```

3. Confirm `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

### Credits Not Added After Purchase

1. Check webhook events were delivered (Stripe Dashboard → Webhooks)
2. Verify `userId` in checkout session metadata
3. Check database for transaction records with `stripeEventId`
4. Review webhook handler logs

### Mercury Verification Failing

1. Use Wire details, not ACH
2. Ensure account holder name matches exactly
3. Wait 2-3 business days for microdeposits
4. Contact Mercury support if issues persist

### Payment Flow Issues

1. Check customer has valid payment method
2. Verify price IDs are correctly set in environment
3. Review Stripe Dashboard → Payments for failure reasons
4. Check webhook signature verification in code

---

## Support Links

- Stripe Dashboard: https://dashboard.stripe.com/acct_1Snq0B8LghiREdMS
- Stripe Support: https://support.stripe.com
- Mercury Dashboard: https://mercury.com
- Mercury Support: https://mercury.com/support
- Parse Repository: /Users/kurultai/Eris/Parse
