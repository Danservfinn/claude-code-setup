/**
 * Link Mercury Bank Account to Stripe
 *
 * This script links your Mercury business bank account to Stripe for payouts.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... MERCURY_ROUTING=... MERCURY_ACCOUNT=... npx tsx link-mercury-account.ts
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

interface BankAccountConfig {
  routingNumber: string
  accountNumber: string
  accountHolderName: string
  accountHolderType: 'company' | 'individual'
}

async function linkBankAccount(config: BankAccountConfig) {
  console.log('Linking Mercury Bank to Stripe')
  console.log('==============================\n')

  try {
    // Get the Stripe account ID
    const account = await stripe.accounts.retrieve()
    console.log(`Stripe Account: ${account.id}`)

    // Create external bank account
    const bankAccount = await stripe.accounts.createExternalAccount(
      account.id,
      {
        external_account: {
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          routing_number: config.routingNumber,
          account_number: config.accountNumber,
          account_holder_type: config.accountHolderType,
          account_holder_name: config.accountHolderName,
        },
      }
    )

    console.log('\nBank account linked successfully!')
    console.log('\nBank Account Details:')
    console.log('  Bank Name:', (bankAccount as any).bank_name || 'Pending verification')
    console.log('  Account Last 4:', (bankAccount as any).last4 || '****')
    console.log('  Routing Number:', config.routingNumber)
    console.log('  Status:', bankAccount.status)

    console.log('\nNext Steps:')
    console.log('  1. Stripe will send 2 micro-deposits to your Mercury account')
    console.log('  2. This usually takes 1-2 business days')
    console.log('  3. Check Mercury for the deposits (amounts will be under $1.00)')
    console.log('  4. Return to Stripe Dashboard -> Settings -> Payouts to verify')
    console.log('  5. Enter the two deposit amounts to complete verification')

    return bankAccount
  } catch (error: any) {
    console.error('\nError linking bank account:', error.message)
    throw error
  }
}

// ============================================================================
// Run Setup
// ============================================================================

const routingNumber = process.env.MERCURY_ROUTING
const accountNumber = process.env.MERCURY_ACCOUNT

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY environment variable is required')
  process.exit(1)
}

if (!routingNumber || !accountNumber) {
  console.error('ERROR: MERCURY_ROUTING and MERCURY_ACCOUNT environment variables are required')
  console.error('\nUsage:')
  console.error('  STRIPE_SECRET_KEY=sk_live_... \\')
  console.error('  MERCURY_ROUTING=026073008 \\')
  console.error('  MERCURY_ACCOUNT=123456789 \\')
  console.error('  npx tsx link-mercury-account.ts')
  console.error('\nGet your Mercury account details from: https://mercury.com -> Account -> Account Details')
  process.exit(1)
}

linkBankAccount({
  routingNumber,
  accountNumber,
  accountHolderName: 'Kurultai Limited Liability Company',
  accountHolderType: 'company',
}).catch((error) => {
  console.error('Setup failed:', error)
  process.exit(1)
})
