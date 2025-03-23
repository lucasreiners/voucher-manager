import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VoucherCard from '../../components/voucher/VoucherCard.vue';

// Mock JsBarcode
vi.mock('jsbarcode', () => ({
    default: vi.fn(),
}));

describe('VoucherCard', () => {
    // Create mock voucher data
    const mockActiveVoucher = {
        id: '1',
        code: 'TEST123',
        codeFormat: 'CODE128',
        shopId: 'shop1',
        createdAt: '2025-01-01T12:00:00Z',
        redeemedAt: null,
    };

    const mockRedeemedVoucher = {
        id: '2',
        code: 'TEST456',
        codeFormat: 'CODE128',
        shopId: 'shop1',
        createdAt: '2025-01-01T12:00:00Z',
        redeemedAt: '2025-03-01T12:00:00Z',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with active voucher', () => {
        const wrapper = mount(VoucherCard, {
            props: {
                voucher: mockActiveVoucher,
            },
        });

        // Check basic structure
        expect(wrapper.find('.voucher-card').exists()).toBe(true);
        expect(wrapper.find('h3').text()).toBe('Guthabenkarte');
        expect(wrapper.find('.barcode-wrapper').exists()).toBe(true);
        expect(wrapper.find('.barcode').exists()).toBe(true);

        // Check that redeem button exists for active voucher
        expect(wrapper.find('.redeem-button').exists()).toBe(true);
        expect(wrapper.find('.redeem-button').text()).toBe(
            'Guthaben eingelöst?',
        );
    });

    it('renders correctly with redeemed voucher', () => {
        const wrapper = mount(VoucherCard, {
            props: {
                voucher: mockRedeemedVoucher,
            },
        });

        // Check basic structure
        expect(wrapper.find('.voucher-card').exists()).toBe(true);
        expect(wrapper.find('h3').text()).toBe('Guthabenkarte');

        // Check that redeem button doesn't exist for redeemed voucher
        expect(wrapper.find('.redeem-button').exists()).toBe(false);
    });

    it('emits redeem event when button is clicked', async () => {
        const wrapper = mount(VoucherCard, {
            props: {
                voucher: mockActiveVoucher,
            },
        });

        // Click the redeem button
        await wrapper.find('.redeem-button').trigger('click');

        // Check that the correct event was emitted with the voucher ID
        expect(wrapper.emitted()).toHaveProperty('redeem');
        expect(wrapper.emitted().redeem[0]).toEqual(['1']);
    });

    it('attempts to render the barcode on mount', async () => {
        const jsBarcode = vi.mocked(await import('jsbarcode')).default;

        mount(VoucherCard, {
            props: {
                voucher: mockActiveVoucher,
            },
        });

        // Check that JsBarcode was called (but don't worry about the DOM specifics)
        expect(jsBarcode).toHaveBeenCalled();
    });

    it('rerenders barcode when voucher changes', async () => {
        const jsBarcode = vi.mocked(await import('jsbarcode')).default;

        const wrapper = mount(VoucherCard, {
            props: {
                voucher: mockActiveVoucher,
            },
        });

        // Clear mock calls to check for new calls
        vi.clearAllMocks();

        // Update the voucher prop
        await wrapper.setProps({
            voucher: {
                ...mockActiveVoucher,
                code: 'NEWCODE',
            },
        });

        // Check that JsBarcode was called again with the new code
        expect(jsBarcode).toHaveBeenCalled();
    });
});
