import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VoucherForm from '../../components/voucher/VoucherForm.vue';
import * as apiService from '../../services/apiService';
import { useVoucherStore } from '../../state/voucherStore';

// Mock Html5Qrcode
vi.mock('html5-qrcode', () => ({
    Html5Qrcode: vi.fn().mockImplementation(() => ({
        start: vi.fn().mockResolvedValue(undefined),
        stop: vi.fn().mockResolvedValue(undefined),
    })),
}));

// Mock the API service
vi.mock('../../services/apiService', () => ({
    createVoucher: vi.fn(),
}));

describe('VoucherForm', () => {
    const shopId = 'shop123';

    beforeEach(() => {
        // Create a fresh pinia instance for each test
        setActivePinia(createPinia());

        // Clear all mocks
        vi.clearAllMocks();

        // Reset the DOM - important for HTML5QrCode which might manipulate the DOM
        document.body.innerHTML = '';
        const qrReader = document.createElement('div');
        qrReader.id = 'qr-reader';
        document.body.appendChild(qrReader);
    });

    it('initializes with correct default values', () => {
        const wrapper = shallowMount(VoucherForm, {
            props: {
                shopId,
            },
            global: {
                stubs: {
                    VCard: true,
                    VCardText: true,
                    VRow: true,
                    VCol: true,
                    VTextField: true,
                    VSelect: true,
                    VBtn: true,
                    VSnackbar: true,
                },
            },
        });

        // Check initial state
        expect(wrapper.vm.voucherCode).toBe('');
        expect(wrapper.vm.isSubmitting).toBe(false);
        expect(wrapper.vm.error).toBe(null);
        expect(wrapper.vm.showScanner).toBe(false);
    });

    it('creates a voucher successfully when form is submitted', async () => {
        const mockVoucher = {
            id: 'voucher123',
            shopId,
            code: 'TEST123',
            codeFormat: 'CODE128',
            createdAt: '2025-03-23T12:00:00Z',
            redeemedAt: null,
        };

        // Setup the mock to return our test data
        vi.mocked(apiService.createVoucher).mockResolvedValue(mockVoucher);

        const wrapper = shallowMount(VoucherForm, {
            props: {
                shopId,
            },
            global: {
                stubs: {
                    VCard: true,
                    VCardText: true,
                    VRow: true,
                    VCol: true,
                    VTextField: true,
                    VSelect: true,
                    VBtn: true,
                    VSnackbar: true,
                },
            },
        });

        // Set values directly on the component instance
        wrapper.vm.voucherCode = 'TEST123';
        wrapper.vm.codeFormat = 'CODE128';

        // Create a mock event
        const mockEvent = { preventDefault: vi.fn() };

        // Call the method directly
        await wrapper.vm.handleSubmit(mockEvent);

        // Check API was called with correct params
        expect(apiService.createVoucher).toHaveBeenCalledWith(
            shopId,
            'TEST123',
            'CODE128',
        );

        // Check store was updated
        const voucherStore = useVoucherStore();
        expect(voucherStore.vouchers.length).toBe(1);
        expect(voucherStore.vouchers[0]).toEqual(mockVoucher);

        // Check success message
        expect(wrapper.vm.snackbar).toBe(true);
        expect(wrapper.vm.snackbarMessage).toBe(
            'Voucher was successfully added!',
        );
        expect(wrapper.vm.snackbarColor).toBe('success');

        // Check form was reset
        expect(wrapper.vm.voucherCode).toBe('');
    });

    it('handles errors when creating a voucher', async () => {
        const errorMessage = 'Error creating voucher';

        // Setup the mock to throw an error
        vi.mocked(apiService.createVoucher).mockRejectedValue(
            new Error(errorMessage),
        );

        const wrapper = shallowMount(VoucherForm, {
            props: {
                shopId,
            },
            global: {
                stubs: {
                    VCard: true,
                    VCardText: true,
                    VRow: true,
                    VCol: true,
                    VTextField: true,
                    VSelect: true,
                    VBtn: true,
                    VSnackbar: true,
                },
            },
        });

        // Set values directly on the component instance
        wrapper.vm.voucherCode = 'TEST123';

        // Create a mock event
        const mockEvent = { preventDefault: vi.fn() };

        // Call the method directly
        await wrapper.vm.handleSubmit(mockEvent);

        // Check API was called
        expect(apiService.createVoucher).toHaveBeenCalled();

        // Check error is displayed
        expect(wrapper.vm.error).toBe(errorMessage);
    });
});
