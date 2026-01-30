/**
 * Shared Stripe Client
 *
 * Provides a configured Stripe client instance for use across
 * finance and operations scripts.
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true
    });
  }

  return stripeInstance;
}

// Price IDs for Parse products
export const PARSE_PRICE_IDS = {
  // Subscriptions
  pro_monthly: 'price_1SrWHX8LghiREdMSL26rdsSH',
  pro_annual: 'price_1SrWHY8LghiREdMSyEyzq1j3',
  max_monthly: 'price_1SrWHY8LghiREdMSN6D82M6g',
  max_annual: 'price_1SrWHY8LghiREdMSEJVUeHU7',

  // Credit Packs
  starter_pack: 'price_1SrWHZ8LghiREdMS0bq7hsI7',
  growth_pack: 'price_1SrWHa8LghiREdMSjBnAWps3',
  power_pack: 'price_1SrWHa8LghiREdMSGCDAl5t3'
} as const;

// Pricing information
export const PARSE_PRICING = {
  pro_monthly: { price: 9.00, credits: 100 },
  pro_annual: { price: 90.00, credits: 1200 },
  max_monthly: { price: 69.00, credits: 1000 },
  max_annual: { price: 690.00, credits: 12000 },
  starter_pack: { price: 4.99, credits: 10 },
  growth_pack: { price: 12.99, credits: 30 },
  power_pack: { price: 34.99, credits: 100 }
} as const;

export default getStripeClient;
