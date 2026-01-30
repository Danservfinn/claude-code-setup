/**
 * Shared Mercury Client
 *
 * Provides a Mercury API client for querying bank account
 * information and transaction history.
 *
 * Environment Variables Required:
 * - MERCURY_API_KEY: Mercury API key
 */

const MERCURY_BASE_URL = 'https://api.mercury.com/api/v1';

export interface MercuryAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings';
  routingNumber: string;
  accountNumber: string;
  availableBalance: number;
  currentBalance: number;
  status: 'active' | 'pending' | 'closed';
}

export interface MercuryTransaction {
  id: string;
  amount: number;
  bankDescription: string;
  counterpartyName?: string;
  createdAt: string;
  dashboardLink: string;
  details?: {
    domesticWireRoutingInfo?: object;
    electronicRoutingInfo?: object;
  };
  externalMemo?: string;
  failedAt?: string;
  feeId?: string;
  kind: 'externalTransfer' | 'internalTransfer' | 'outgoingPayment' | 'incomingPayment';
  note?: string;
  postedAt?: string;
  status: 'pending' | 'sent' | 'completed' | 'failed' | 'cancelled';
}

class MercuryClient {
  private apiKey: string;

  constructor() {
    if (!process.env.MERCURY_API_KEY) {
      throw new Error('MERCURY_API_KEY environment variable is required');
    }
    this.apiKey = process.env.MERCURY_API_KEY;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${MERCURY_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercury API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getAccounts(): Promise<{ accounts: MercuryAccount[] }> {
    return this.request<{ accounts: MercuryAccount[] }>('/accounts');
  }

  async getAccount(accountId: string): Promise<MercuryAccount> {
    return this.request<MercuryAccount>(`/accounts/${accountId}`);
  }

  async getTransactions(
    accountId: string,
    options?: {
      limit?: number;
      offset?: number;
      start?: string; // ISO date
      end?: string;   // ISO date
      status?: string;
    }
  ): Promise<{ transactions: MercuryTransaction[] }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));
    if (options?.start) params.append('start', options.start);
    if (options?.end) params.append('end', options.end);
    if (options?.status) params.append('status', options.status);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ transactions: MercuryTransaction[] }>(
      `/account/${accountId}/transactions${query}`
    );
  }

  async getTotalBalance(): Promise<{ total: number; accounts: Array<{ name: string; balance: number }> }> {
    const { accounts } = await this.getAccounts();

    const activeAccounts = accounts.filter(a => a.status === 'active');
    const total = activeAccounts.reduce((sum, a) => sum + a.availableBalance, 0);

    return {
      total,
      accounts: activeAccounts.map(a => ({
        name: a.name,
        balance: a.availableBalance
      }))
    };
  }
}

let mercuryInstance: MercuryClient | null = null;

export function getMercuryClient(): MercuryClient {
  if (!mercuryInstance) {
    mercuryInstance = new MercuryClient();
  }
  return mercuryInstance;
}

export default getMercuryClient;
