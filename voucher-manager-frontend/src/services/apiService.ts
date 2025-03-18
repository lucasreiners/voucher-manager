import type { Shop, Voucher } from '../types';

// Using proxied API endpoint
const API_BASE_URL = '';

export async function fetchShops(): Promise<Shop[]> {
  const response = await fetch(`${API_BASE_URL}/api/shops`);
  if (!response.ok) {
    throw new Error('Failed to fetch shops');
  }
  return response.json();
}

export async function fetchVouchers(): Promise<Voucher[]> {
  const response = await fetch(`${API_BASE_URL}/api/vouchers`);
  if (!response.ok) {
    throw new Error('Failed to fetch vouchers');
  }
  return response.json();
}

export async function createVoucher(shopId: string, code: string): Promise<Voucher> {
  const response = await fetch(`${API_BASE_URL}/api/shops/${shopId}/vouchers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create voucher');
  }
  return response.json();
}

export async function redeemVoucher(voucherId: string): Promise<Voucher> {
  const response = await fetch(`${API_BASE_URL}/api/vouchers/${voucherId}/redeem`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to redeem voucher');
  }
  return response.json();
}