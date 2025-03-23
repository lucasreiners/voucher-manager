import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as apiService from '../../services/apiService';
import { useShopStore } from '../../state/shopStore';

// Mock the API service
vi.mock('../../services/apiService', () => ({
    fetchShops: vi.fn(),
}));

describe('Shop Store', () => {
    beforeEach(() => {
        // Create a fresh pinia instance for each test
        setActivePinia(createPinia());

        // Clear all mocks
        vi.clearAllMocks();
    });

    it('initializes with empty state', () => {
        const shopStore = useShopStore();
        expect(shopStore.shops).toEqual([]);
        expect(shopStore.isLoading).toBe(false);
        expect(shopStore.error).toBe(null);
    });

    it('sets shops correctly', () => {
        const shopStore = useShopStore();
        const mockShops = [
            {
                id: '1',
                name: 'Test Shop 1',
                iconUrl: 'test1.png',
                backgroundColor: '#ff0000',
            },
            {
                id: '2',
                name: 'Test Shop 2',
                iconUrl: 'test2.png',
                backgroundColor: '#00ff00',
            },
        ];

        shopStore.setShops(mockShops);
        expect(shopStore.shops).toEqual(mockShops);
    });

    it('loads shops successfully', async () => {
        const mockShops = [
            {
                id: '1',
                name: 'Test Shop 1',
                iconUrl: 'test1.png',
                backgroundColor: '#ff0000',
            },
            {
                id: '2',
                name: 'Test Shop 2',
                iconUrl: 'test2.png',
                backgroundColor: '#00ff00',
            },
        ];

        // Setup the mock to return our test data
        vi.mocked(apiService.fetchShops).mockResolvedValue(mockShops);

        const shopStore = useShopStore();
        await shopStore.loadShops();

        expect(apiService.fetchShops).toHaveBeenCalledTimes(1);
        expect(shopStore.shops).toEqual(mockShops);
        expect(shopStore.isLoading).toBe(false);
        expect(shopStore.error).toBe(null);
    });

    it('handles errors when loading shops', async () => {
        const errorMessage = 'Network error';

        // Setup the mock to throw an error
        vi.mocked(apiService.fetchShops).mockRejectedValue(
            new Error(errorMessage),
        );

        const shopStore = useShopStore();
        await shopStore.loadShops();

        expect(apiService.fetchShops).toHaveBeenCalledTimes(1);
        expect(shopStore.shops).toEqual([]);
        expect(shopStore.isLoading).toBe(false);
        expect(shopStore.error).toBe(errorMessage);
    });
});
