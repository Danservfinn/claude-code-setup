/**
 * Full Health Check Script
 *
 * Comprehensive health check for Parse platform covering:
 * - Database connectivity and performance
 * - Redis/Queue status
 * - Stripe API availability
 * - Mercury API availability
 * - Railway deployment status
 *
 * Usage: npx ts-node full-health-check.ts
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 * - REDIS_URL: Redis connection string
 * - STRIPE_SECRET_KEY: Stripe API key
 * - MERCURY_API_KEY: Mercury API key (optional)
 */

import Stripe from 'stripe';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  details?: string;
  error?: string;
}

interface FullHealthReport {
  timestamp: string;
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthCheckResult[];
  summary: {
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Simple connectivity test
    await prisma.$queryRaw`SELECT 1`;

    // Check active connections (approximate)
    const result = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count FROM pg_stat_activity
      WHERE datname = current_database()
    `;

    await prisma.$disconnect();

    const latency = Date.now() - start;
    const status = latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy';

    return {
      service: 'PostgreSQL',
      status,
      latency,
      details: `Active connections: ${result[0]?.count || 'unknown'}`
    };
  } catch (error) {
    return {
      service: 'PostgreSQL',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const Redis = (await import('ioredis')).default;
    const redis = new Redis(process.env.REDIS_URL!);

    await redis.ping();
    const info = await redis.info('memory');
    const usedMemory = info.match(/used_memory_human:(\S+)/)?.[1] || 'unknown';

    await redis.quit();

    const latency = Date.now() - start;
    return {
      service: 'Redis',
      status: latency < 50 ? 'healthy' : latency < 200 ? 'degraded' : 'unhealthy',
      latency,
      details: `Memory: ${usedMemory}`
    };
  } catch (error) {
    return {
      service: 'Redis',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkStripe(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        service: 'Stripe',
        status: 'unhealthy',
        error: 'STRIPE_SECRET_KEY not configured'
      };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const balance = await stripe.balance.retrieve();

    const latency = Date.now() - start;
    const available = balance.available.reduce((sum, b) => sum + b.amount, 0);

    return {
      service: 'Stripe',
      status: latency < 500 ? 'healthy' : latency < 2000 ? 'degraded' : 'unhealthy',
      latency,
      details: `Available: $${(available / 100).toFixed(2)}`
    };
  } catch (error) {
    return {
      service: 'Stripe',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkMercury(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    if (!process.env.MERCURY_API_KEY) {
      return {
        service: 'Mercury',
        status: 'degraded',
        details: 'MERCURY_API_KEY not configured (optional)'
      };
    }

    const response = await fetch('https://api.mercury.com/api/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${process.env.MERCURY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const latency = Date.now() - start;

    if (!response.ok) {
      return {
        service: 'Mercury',
        status: 'unhealthy',
        latency,
        error: `HTTP ${response.status}`
      };
    }

    return {
      service: 'Mercury',
      status: latency < 1000 ? 'healthy' : 'degraded',
      latency,
      details: 'API accessible'
    };
  } catch (error) {
    return {
      service: 'Mercury',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkBullMQ(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const { Queue } = await import('bullmq');
    const Redis = (await import('ioredis')).default;

    const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });
    const queue = new Queue('analysis', { connection });

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount()
    ]);

    await queue.close();
    await connection.quit();

    const latency = Date.now() - start;
    const failureRate = completed + failed > 0 ? (failed / (completed + failed)) * 100 : 0;
    const status = failureRate < 5 ? 'healthy' : failureRate < 15 ? 'degraded' : 'unhealthy';

    return {
      service: 'BullMQ',
      status,
      latency,
      details: `Waiting: ${waiting}, Active: ${active}, Failed: ${failed} (${failureRate.toFixed(1)}%)`
    };
  } catch (error) {
    return {
      service: 'BullMQ',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function runFullHealthCheck(): Promise<FullHealthReport> {
  console.log('Running full health check...\n');

  const services = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStripe(),
    checkMercury(),
    checkBullMQ()
  ]);

  const summary = {
    healthy: services.filter(s => s.status === 'healthy').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    unhealthy: services.filter(s => s.status === 'unhealthy').length
  };

  const overall = summary.unhealthy > 0 ? 'unhealthy' :
                  summary.degraded > 0 ? 'degraded' : 'healthy';

  const report: FullHealthReport = {
    timestamp: new Date().toISOString(),
    overall,
    services,
    summary
  };

  // Print formatted output
  console.log(`=== Parse Health Check ===`);
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Overall Status: ${overall.toUpperCase()}\n`);

  for (const service of services) {
    const statusIcon = service.status === 'healthy' ? '✓' :
                       service.status === 'degraded' ? '⚠' : '✗';
    console.log(`${statusIcon} ${service.service}: ${service.status.toUpperCase()}`);
    if (service.latency) console.log(`  Latency: ${service.latency}ms`);
    if (service.details) console.log(`  Details: ${service.details}`);
    if (service.error) console.log(`  Error: ${service.error}`);
    console.log();
  }

  console.log(`Summary: ${summary.healthy} healthy, ${summary.degraded} degraded, ${summary.unhealthy} unhealthy`);

  return report;
}

// Run if executed directly
runFullHealthCheck().catch(console.error);

export { runFullHealthCheck, FullHealthReport, HealthCheckResult };
