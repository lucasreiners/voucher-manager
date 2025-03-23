// This file sets up the testing environment for Vitest
import { beforeAll, vi } from "vitest";
import { config } from "@vue/test-utils";
import { createVuetify } from "vuetify";

// Create a mock handler for all CSS imports
const cssHandler = {
	default: {},
};

// Mock specific CSS imports that are causing problems
vi.mock("vuetify/styles", () => cssHandler);
vi.mock("vuetify/lib/components/VBtn/VBtn.css", () => cssHandler);
vi.mock("vuetify/lib/components/VAlert/VAlert.css", () => cssHandler);
vi.mock("vuetify/lib/components/VCard/VCard.css", () => cssHandler);
vi.mock("vuetify/lib/components/VTextField/VTextField.css", () => cssHandler);
vi.mock("vuetify/lib/components/VSelect/VSelect.css", () => cssHandler);
vi.mock("vuetify/lib/components/VRow/VRow.css", () => cssHandler);
vi.mock("vuetify/lib/components/VCol/VCol.css", () => cssHandler);
vi.mock("vuetify/lib/components/VIcon/VIcon.css", () => cssHandler);
vi.mock("vuetify/lib/components/VContainer/VContainer.css", () => cssHandler);
vi.mock("vuetify/lib/components/VSnackbar/VSnackbar.css", () => cssHandler);

// Create a global Vuetify instance with minimal setup
const vuetify = createVuetify();

// Configure Vue Test Utils with Vuetify
config.global.plugins = [vuetify];

// Add stubbing for global objects needed in our components
beforeAll(() => {
	// Mock window.matchMedia which is not available in the test environment
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
});
