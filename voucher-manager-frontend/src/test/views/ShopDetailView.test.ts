import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { useVoucherStore } from "../../state/voucherStore";
import ShopDetailView from "../../views/ShopDetailView.vue";

// Mock the composable
vi.mock("../../composables/useScreenBrightness", () => ({
	useScreenBrightness: () => ({
		setMaxBrightness: vi.fn(),
		resetBrightness: vi.fn(),
	}),
}));

// Create component stubs that will preserve class names
const createStub = (originalName: string) => ({
	name: originalName,
	template: `<div class="${originalName.toLowerCase()}"><slot /></div>`,
	inheritAttrs: false,
});

describe("ShopDetailView", () => {
	// Mock shop and vouchers data
	const mockShop = {
		id: "1",
		name: "Test Shop",
		backgroundColor: "#ff0000",
		iconUrl: "test.png",
	};

	const mockVouchers = [
		{
			id: "1",
			code: "CODE1",
			codeFormat: "CODE128",
			shopId: "1",
			createdAt: "2025-01-01T12:00:00Z",
			redeemedAt: null,
		},
		{
			id: "2",
			code: "CODE2",
			codeFormat: "CODE128",
			shopId: "1",
			createdAt: "2025-01-02T12:00:00Z",
			redeemedAt: "2025-03-01T10:00:00Z",
		},
	];

	let router;

	beforeEach(() => {
		// Create a router instance with memory history for testing
		router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{
					path: "/shops/:id",
					name: "shopDetail",
					component: ShopDetailView,
				},
			],
		});
	});

	it("displays shop not found message when no shop is available", async () => {
		// Navigate to the shop detail route
		router.push("/shops/999");
		await router.isReady();

		const wrapper = mount(ShopDetailView, {
			global: {
				plugins: [
					router,
					createTestingPinia({
						createSpy: vi.fn,
						initialState: {
							shop: { shops: [] },
							voucher: { vouchers: [] },
						},
					}),
				],
				stubs: {
					VContainer: createStub("v-container"),
					VAlert: createStub("v-alert"),
					VIcon: true,
					ConfirmDialog: true,
					VoucherCard: true,
				},
			},
		});

		expect(wrapper.find(".shop-detail-error").exists()).toBe(true);
		expect(wrapper.find(".v-alert").exists()).toBe(true);
		expect(wrapper.html()).toContain("Shop nicht gefunden");
	});

	it("displays shop details and active voucher section", async () => {
		// Navigate to the shop detail route
		router.push("/shops/1");
		await router.isReady();

		const wrapper = mount(ShopDetailView, {
			global: {
				plugins: [
					router,
					createTestingPinia({
						createSpy: vi.fn,
						initialState: {
							shop: { shops: [mockShop] },
							voucher: { vouchers: mockVouchers },
						},
					}),
				],
				stubs: {
					VContainer: createStub("v-container"),
					VAlert: createStub("v-alert"),
					VIcon: true,
					ConfirmDialog: true,
					VoucherCard: true,
				},
			},
		});

		// Verify shop details are displayed
		expect(wrapper.find(".shop-detail").exists()).toBe(true);
		expect(wrapper.find(".shop-header").exists()).toBe(true);
		expect(wrapper.find(".shop-header h2").text()).toBe(mockShop.name);

		// Verify active voucher section exists
		expect(wrapper.find(".featured-voucher-container").exists()).toBe(true);
		expect(wrapper.find(".section-title").text()).toContain(
			"Aktiver Gutschein",
		);
	});

	it("handles voucher redemption", async () => {
		// Navigate to the shop detail route
		router.push("/shops/1");
		await router.isReady();

		const wrapper = mount(ShopDetailView, {
			global: {
				plugins: [
					router,
					createTestingPinia({
						createSpy: vi.fn,
						stubActions: false,
						initialState: {
							shop: { shops: [mockShop] },
							voucher: { vouchers: mockVouchers },
						},
					}),
				],
				stubs: {
					VContainer: createStub("v-container"),
					VAlert: createStub("v-alert"),
					VIcon: true,
					ConfirmDialog: true,
					VoucherCard: {
						template: '<div class="voucher-card"></div>',
						props: ["voucher"],
					},
				},
			},
		});

		// Get the Pinia store
		const voucherStore = useVoucherStore();
		voucherStore.redeemVoucher = vi.fn().mockResolvedValue(undefined);

		// Directly trigger dialog and confirm
		wrapper.vm.showConfirmDialog = true;
		await wrapper.vm.handleConfirm();

		// Verify store method was called with the right voucher ID
		expect(voucherStore.redeemVoucher).toHaveBeenCalledWith(mockVouchers[0].id);
		expect(wrapper.vm.showConfirmDialog).toBe(false);
	});

	it("toggles redeemed vouchers visibility", async () => {
		// Navigate to the shop detail route
		router.push("/shops/1");
		await router.isReady();

		const wrapper = mount(ShopDetailView, {
			global: {
				plugins: [
					router,
					createTestingPinia({
						createSpy: vi.fn,
						initialState: {
							shop: { shops: [mockShop] },
							voucher: { vouchers: mockVouchers },
						},
					}),
				],
				stubs: {
					VContainer: createStub("v-container"),
					VAlert: createStub("v-alert"),
					VIcon: true,
					ConfirmDialog: true,
					VoucherCard: true,
				},
			},
		});

		// Initially redeemed vouchers should be hidden
		expect(wrapper.vm.showRedeemedVouchers).toBe(false);

		// Call the toggle function
		await wrapper.vm.toggleRedeemedVouchers();

		// Redeemed vouchers should now be visible
		expect(wrapper.vm.showRedeemedVouchers).toBe(true);

		// Toggle again to hide
		await wrapper.vm.toggleRedeemedVouchers();

		// Redeemed vouchers should be hidden again
		expect(wrapper.vm.showRedeemedVouchers).toBe(false);
	});
});
