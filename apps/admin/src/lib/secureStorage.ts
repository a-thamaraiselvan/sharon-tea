/**
 * Simple AES-like obfuscation / encoding for localStorage sensitive items.
 * Uses base64 encoding with XOR mask and prefix verification.
 */

const STORAGE_PREFIX = 'sharon_admin_enc_v1:';
const XOR_KEY = 0x5a; // Key for bitwise XOR scrambling

export const secureStorage = {
  setItem(key: string, value: unknown): void {
    try {
      const jsonString = JSON.stringify(value);
      // XOR mask each character code
      let masked = '';
      for (let i = 0; i < jsonString.length; i++) {
        masked += String.fromCharCode(jsonString.charCodeAt(i) ^ XOR_KEY);
      }
      // Base64 encode
      const encoded = window.btoa(encodeURIComponent(masked));
      localStorage.setItem(key, `${STORAGE_PREFIX}${encoded}`);
    } catch (error) {
      console.error(`Failed to securely store item for key: ${key}`, error);
    }
  },

  getItem<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      if (!raw.startsWith(STORAGE_PREFIX)) {
        // Fallback for unencoded legacy or normal strings
        try {
          return JSON.parse(raw) as T;
        } catch {
          return raw as unknown as T;
        }
      }

      const encoded = raw.slice(STORAGE_PREFIX.length);
      const masked = decodeURIComponent(window.atob(encoded));
      let unmasked = '';
      for (let i = 0; i < masked.length; i++) {
        unmasked += String.fromCharCode(masked.charCodeAt(i) ^ XOR_KEY);
      }
      return JSON.parse(unmasked) as T;
    } catch (error) {
      console.warn(`Failed to securely retrieve item for key: ${key}`, error);
      return null;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item for key: ${key}`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear secure storage', error);
    }
  },
};
