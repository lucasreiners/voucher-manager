const API_BASE_URL = '/api';

export const fetchShops = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shops`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch shops:', error);
    throw error;
  }
};

export const fetchVouchers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch vouchers:', error);
    throw error;
  }
};

export const redeemVoucher = async (voucherId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers/${voucherId}/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to redeem voucher:', error);
    throw error;
  }
};

export async function createVoucher({ shopId, code }) {
  const response = await fetch(`${API_BASE_URL}/vouchers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shopId, code }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create voucher');
  }
  
  return response.json();
}