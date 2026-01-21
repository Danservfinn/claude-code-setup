const Stripe = require('stripe');
const stripe = new Stripe('sk_live_YOUR_SECRET_KEY_HERE');

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
  
  console.log('✅ Webhook created successfully!');
  console.log('\nWebhook ID:', webhook.id);
  console.log('Webhook URL:', webhook.url);
  console.log('\n⚠️  IMPORTANT: Save this webhook secret for your environment variables:');
  console.log('\nSTRIPE_WEBHOOK_SECRET="' + webhook.secret + '"\n');
}

createWebhook().catch(console.error);
