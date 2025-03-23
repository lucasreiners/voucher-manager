import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as apiService from '../../services/apiService';
import { useVoucherStore } from '../../state/voucherStore';

// Mock the API service
vi.mock('../../services/apiService', () => ({
    fetchVouchers: vi.fn(),
    redeemVoucher: vi.fn(),
}));

describe('Voucher Store', () => {
    beforeEach(() => {
        // Create a fresh pinia instance for each test
        setActivePinia(createPinia());

        // Clear all mocks
        vi.clearAllMocks();
    });

    it('initializes with empty state', () => {
        const voucherStore = useVoucherStore();
        expect(voucherStore.vouchers).toEqual([]);
        expect(voucherStore.isLoading).toBe(false);
        expect(voucherStore.error).toBe(null);
    });

    it('sets vouchers correctly', () => {
        const voucherStore = useVoucherStore();
        const mockVouchers = [
            {
                id: '1',
                code: 'CODE1',
                shopId: '1',
                createdAt: '2025-01-01T12:00:00Z',
                redeemedAt: null,
            },
            {
                id: '2',
                code: 'CODE2',
                shopId: '1',
                createdAt: '2025-01-02T12:00:00Z',
                redeemedAt: '2025-01-03T12:00:00Z',
            },
        ];

        voucherStore.setVouchers(mockVouchers);
        expect(voucherStore.vouchers).toEqual(mockVouchers);
    });

    it('loads vouchers successfully', async () => {
        const mockVouchers = [
            {
                id: '1',
                code: 'CODE1',
                shopId: '1',
                createdAt: '2025-01-01T12:00:00Z',
                redeemedAt: null,
            },
            {
                id: '2',
                code: 'CODE2',
                shopId: '1',
                createdAt: '2025-01-02T12:00:00Z',
                redeemedAt: '2025-01-03T12:00:00Z',
            },
        ];

        // Setup the mock to return our test data
        vi.mocked(apiService.fetchVouchers).mockResolvedValue(mockVouchers);

        const voucherStore = useVoucherStore();
        await voucherStore.loadVouchers();

        expect(apiService.fetchVouchers).toHaveBeenCalledTimes(1);
        expect(voucherStore.vouchers).toEqual(mockVouchers);
        expect(voucherStore.isLoading).toBe(false);
        expect(voucherStore.error).toBe(null);
    });

    it('handles errors when loading vouchers', async () => {
        const errorMessage = 'Network error';

        // Setup the mock to throw an error
        vi.mocked(apiService.fetchVouchers).mockRejectedValue(
            new Error(errorMessage),
        );

        const voucherStore = useVoucherStore();
        await voucherStore.loadVouchers();

        expect(apiService.fetchVouchers).toHaveBeenCalledTimes(1);
        expect(voucherStore.vouchers).toEqual([]);
        expect(voucherStore.isLoading).toBe(false);
        expect(voucherStore.error).toBe(errorMessage);
    });

    it('redeems a voucher successfully', async () => {
        const voucherId = '1';
        const mockVouchers = [
            {
                id: '1',
                code: 'CODE1',
                shopId: '1',
                createdAt: '2025-01-01T12:00:00Z',
                redeemedAt: null,
            },
            {
                id: '2',
                code: 'CODE2',
                shopId: '1',
                createdAt: '2025-01-02T12:00:00Z',
                redeemedAt: '2025-01-03T12:00:00Z',
            },
        ];

        const updatedVoucher = {
            ...mockVouchers[0],
            redeemedAt: '2025-03-23T12:00:00Z',
        };

        // Setup the store with initial vouchers
        const voucherStore = useVoucherStore();
        voucherStore.setVouchers(mockVouchers);

        // Mock the API response
        vi.mocked(apiService.redeemVoucher).mockResolvedValue(updatedVoucher);

        // Call the method
        await voucherStore.redeemVoucher(voucherId);

        // Verify the API was called and the store was updated
        expect(apiService.redeemVoucher).toHaveBeenCalledWith(voucherId);
        expect(voucherStore.vouchers[0]).toEqual(updatedVoucher);
    });

    it('throws error when redeeming voucher fails', async () => {
        const voucherId = '1';
        const errorMessage = 'Failed to redeem voucher';

        // Setup the mock to throw an error
        vi.mocked(apiService.redeemVoucher).mockRejectedValue(
            new Error(errorMessage),
        );

        const voucherStore = useVoucherStore();

        // Expect the method to throw an error
        await expect(voucherStore.redeemVoucher(voucherId)).rejects.toThrow(
            errorMessage,
        );
        expect(apiService.redeemVoucher).toHaveBeenCalledWith(voucherId);
    });
});
