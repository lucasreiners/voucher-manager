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

export async function createVoucher(
    shopId: string,
    code: string,
    codeFormat = 'EAN13',
): Promise<Voucher> {
    // Ensure the shopId is a valid string that can be parsed as UUID
    // Create a properly formatted JSON payload
    const payload = {
        shopId: shopId,
        code: code,
        codeFormat: codeFormat,
    };

    const response = await fetch(`${API_BASE_URL}/api/vouchers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create voucher: ${errorText}`);
    }
    return response.json();
}

export async function redeemVoucher(voucherId: string): Promise<Voucher> {
    const response = await fetch(
        `${API_BASE_URL}/api/vouchers/${voucherId}/redeem`,
        {
            method: 'PUT',
        },
    );

    if (!response.ok) {
        throw new Error('Failed to redeem voucher');
    }
    return response.json();
}
