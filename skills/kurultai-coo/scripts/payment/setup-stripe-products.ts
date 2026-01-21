/**
 * Stripe Products Setup Script
 *
 * This script creates all products and prices for Parse payment integration.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe-products.ts
 *
 * For production:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

// ============================================================================
// Product Definitions
// ============================================================================

interface ProductConfig {
  name: string
  description: string
  prices: Array<{
    nickname: string
    amount: number
    currency: string
    recurring?: { interval: 'month' | 'year' }
    metadata: Record<string, string>
  }>
}

const PRODUCTS: ProductConfig[] = [
  // Subscription Products
  {
    name: 'Pro Subscription',
    description: '100 credits per month with full analysis features',
    prices: [
      {
        nickname: 'Pro Monthly',
        amount: 900, // $9.00
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: { tierId: 'tier_pro', billing: 'monthly', credits: '100' },
      },
      {
        nickname: 'Pro Annual',
        amount: 9000, // $90.00
        currency: 'usd',
        recurring: { interval: 'year' },
        metadata: { tierId: 'tier_pro', billing: 'annual', credits: '100' },
      },
    ],
  },
  {
    name: 'Max Subscription',
    description: '1000 credits per month with API access and priority support',
    prices: [
      {
        nickname: 'Max Monthly',
        amount: 6900, // $69.00
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: { tierId: 'tier_max', billing: 'monthly', credits: '1000' },
      },
      {
        nickname: 'Max Annual',
        amount: 69000, // $690.00
        currency: 'usd',
        recurring: { interval: 'year' },
        metadata: { tierId: 'tier_max', billing: 'annual', credits: '1000' },
      },
    ],
  },
  // Credit Pack Products
  {
    name: 'Starter Credit Pack',
    description: '10 credits for occasional analysis',
    prices: [
      {
        nickname: 'Starter Pack',
        amount: 499, // $4.99
        currency: 'usd',
        metadata: { packId: 'pack_starter', credits: '10' },
      },
    ],
  },
  {
    name: 'Growth Credit Pack',
    description: '30 credits for active users',
    prices: [
      {
        nickname: 'Growth Pack',
        amount: 1299, // $12.99
        currency: 'usd',
        metadata: { packId: 'pack_growth', credits: '30' },
      },
    ],
  },
  {
    name: 'Power Credit Pack',
    description: '100 credits for power users',
    prices: [
      {
        nickname: 'Power Pack',
        amount: 3499, // $34.99
        currency: 'usd',
        metadata: { packId: 'pack_power', credits: '100' },
      },
    ],
  },
]

// ============================================================================
// Setup Functions
// ============================================================================

/**
 * Create a product with its prices
 */
async function createProduct(config: ProductConfig) {
  console.log(`\nCreating product: ${config.name}`)

  // Create the product
  const product = await stripe.products.create({
    name: config.name,
    description: config.description,
    metadata: {
      app: 'parse',
      createdAt: new Date().toISOString(),
    },
  })

  console.log(`  ✓ Product created: ${product.id}`)

  // Create prices for this product
  const priceIds: Record<string, string> = {}

  for (const priceConfig of config.prices) {
    const price = await stripe.prices.create({
      product: product.id,
      nickname: priceConfig.nickname,
      unit_amount: priceConfig.amount,
      currency: priceConfig.currency,
      recurring: priceConfig.recurring,
      metadata: priceConfig.metadata,
    })

    priceIds[priceConfig.nickname] = price.id
    console.log(`  ✓ Price created: ${priceConfig.nickname} (${price.id})`)
  }

  return { product, priceIds }
}

/**
 * Main setup function
 */
async function setupStripeProducts() {
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║           Parse Stripe Products & Prices Setup                 ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')

  const results: Array<{
    product: Stripe.Product
    priceIds: Record<string, string>
  }> = []

  for (const productConfig of PRODUCTS) {
    const result = await createProduct(productConfig)
    results.push(result)
  }

  // Print summary and environment variables
  console.log('\n\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║                    Setup Complete!                            ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')

  console.log('\n📋 Environment Variables to add to .env or Railway:\n')

  const envVars: string[] = []

  // Find Pro prices
  const proProduct = results.find(r => r.product.name === 'Pro Subscription')
  if (proProduct) {
    envVars.push(`STRIPE_PRICE_TIER_PRO="${proProduct.priceIds['Pro Monthly']}"`)
    envVars.push(`STRIPE_PRICE_TIER_PRO_ANNUAL="${proProduct.priceIds['Pro Annual']}"`)
  }

  // Find Max prices
  const maxProduct = results.find(r => r.product.name === 'Max Subscription')
  if (maxProduct) {
    envVars.push(`STRIPE_PRICE_TIER_MAX="${maxProduct.priceIds['Max Monthly']}"`)
    envVars.push(`STRIPE_PRICE_TIER_MAX_ANNUAL="${maxProduct.priceIds['Max Annual']}"`)
  }

  // Find pack prices
  const starterPack = results.find(r => r.product.name === 'Starter Credit Pack')
  if (starterPack) {
    envVars.push(`STRIPE_PRICE_PACK_STARTER="${starterPack.priceIds['Starter Pack']}"`)
  }

  const growthPack = results.find(r => r.product.name === 'Growth Credit Pack')
  if (growthPack) {
    envVars.push(`STRIPE_PRICE_PACK_GROWTH="${growthPack.priceIds['Growth Pack']}"`)
  }

  const powerPack = results.find(r => r.product.name === 'Power Credit Pack')
  if (powerPack) {
    envVars.push(`STRIPE_PRICE_PACK_POWER="${powerPack.priceIds['Power Pack']}"`)
  }

  for (const envVar of envVars) {
    console.log(envVar)
  }

  console.log('\n✅ Products created successfully!')
  console.log('📝 Copy the environment variables above to your .env file or Railway dashboard.\n')
}

// ============================================================================
// Run Setup
// ============================================================================

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY environment variable is required')
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe-products.ts')
  process.exit(1)
}

setupStripeProducts().catch((error) => {
  console.error('Setup failed:', error)
  process.exit(1)
})
