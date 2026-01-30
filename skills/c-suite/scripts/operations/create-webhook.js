/**
 * Stripe Webhook Setup Script
 *
 * Creates the webhook endpoint for Parse payment integration.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... node create-webhook.js
 *
 * Environment Variables:
 *   STRIPE_SECRET_KEY - Stripe secret key (required)
 */

const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY environment variable is required');
  console.error('Usage: STRIPE_SECRET_KEY=sk_live_... node create-webhook.js');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createWebhook() {
  const webhook = await stripe.webhookEndpoints.create({
    url: 'https://parsethe.media/api/stripe/webhook',
    description: 'Parse Production Webhook',
    enabled_events: [
      'checkout.session.completed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.paid',
      'invoice.payment_failed'
    ],
  });

  console.log('Webhook created successfully!');
  console.log('\nWebhook ID:', webhook.id);
  console.log('Webhook URL:', webhook.url);
  console.log('\nIMPORTANT: Save this webhook secret for your environment variables:');
  console.log('\nSTRIPE_WEBHOOK_SECRET="' + webhook.secret + '"\n');
}

createWebhook().catch(console.error);
