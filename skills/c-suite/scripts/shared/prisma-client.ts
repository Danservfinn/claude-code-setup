/**
 * Shared Prisma Client
 *
 * Provides a configured Prisma client instance for database
 * queries across C-Suite scripts.
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 */

import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    });
  }

  return prismaInstance;
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

// Common financial queries
export const FinancialQueries = {
  /**
   * Get MRR breakdown by tier
   */
  getMRRByTier: async (prisma: PrismaClient) => {
    return prisma.$queryRaw<Array<{
      tierId: string;
      count: bigint;
      mrr: number;
    }>>`
      SELECT
        "tierId",
        COUNT(*) as count,
        SUM(CASE
          WHEN "tierId" = 'tier_pro' AND "stripePriceId" LIKE '%monthly%' THEN 9
          WHEN "tierId" = 'tier_pro' AND "stripePriceId" LIKE '%annual%' THEN 7.5
          WHEN "tierId" = 'tier_max' AND "stripePriceId" LIKE '%monthly%' THEN 69
          WHEN "tierId" = 'tier_max' AND "stripePriceId" LIKE '%annual%' THEN 57.5
          ELSE 0
        END) as mrr
      FROM "Subscription"
      WHERE status = 'active'
      GROUP BY "tierId"
    `;
  },

  /**
   * Get revenue for a time period
   */
  getRevenueByPeriod: async (
    prisma: PrismaClient,
    startDate: Date,
    endDate: Date
  ) => {
    return prisma.$queryRaw<Array<{
      type: string;
      total: number;
      count: bigint;
    }>>`
      SELECT
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM "Transaction"
      WHERE "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status = 'CONFIRMED'
        AND type IN ('CREDIT_PURCHASE', 'SUBSCRIPTION_RENEWAL')
      GROUP BY type
    `;
  },

  /**
   * Get churn data for a time period
   */
  getChurnData: async (prisma: PrismaClient, days: number = 30) => {
    return prisma.$queryRaw<Array<{
      tierId: string;
      churned: bigint;
    }>>`
      SELECT
        "tierId",
        COUNT(*) as churned
      FROM "Subscription"
      WHERE status IN ('canceled', 'unpaid')
        AND "updatedAt" >= NOW() - INTERVAL '${days} days'
      GROUP BY "tierId"
    `;
  },

  /**
   * Get total active users and subscribers
   */
  getUserMetrics: async (prisma: PrismaClient) => {
    const [totalUsers, activeSubscribers, creditsData] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.credits.aggregate({
        _sum: { balance: true, lifetimeSpent: true },
        _avg: { balance: true }
      })
    ]);

    return {
      totalUsers,
      activeSubscribers,
      conversionRate: totalUsers > 0 ? (activeSubscribers / totalUsers) * 100 : 0,
      totalCreditsBalance: creditsData._sum.balance || 0,
      totalCreditsSpent: creditsData._sum.lifetimeSpent || 0,
      avgCreditsBalance: creditsData._avg.balance || 0
    };
  }
};

export default getPrismaClient;
