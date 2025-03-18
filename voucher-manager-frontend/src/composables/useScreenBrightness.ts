interface ScreenBrightness {
  setBrightness: (brightness: number | null) => Promise<void>;
}

export function useScreenBrightness() {
  const setMaxBrightness = async () => {
    try {
      const screen = window.screen as unknown as { brightness?: ScreenBrightness };
      if (screen.brightness) {
        await screen.brightness.setBrightness(1);
      }
    } catch (error) {
      console.warn('Failed to set screen brightness:', error);
    }
  };

  const resetBrightness = async () => {
    try {
      const screen = window.screen as unknown as { brightness?: ScreenBrightness };
      if (screen.brightness) {
        // Let the system manage brightness
        await screen.brightness.setBrightness(null);
      }
    } catch (error) {
      console.warn('Failed to reset screen brightness:', error);
    }
  };

  return {
    setMaxBrightness,
    resetBrightness
  };
}