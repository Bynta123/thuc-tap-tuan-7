import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom trong một số phiên bản Vitest không expose localStorage/sessionStorage trực tiếp
// lên window → tạo mock đơn giản nếu chưa có để test không crash.
function ensureStorage(key: 'localStorage' | 'sessionStorage') {
  if (typeof window !== 'undefined' && !window[key]) {
    const store: Record<string, string> = {};
    Object.defineProperty(window, key, {
      configurable: true,
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = String(v); },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      } satisfies Storage,
    });
  }
}

ensureStorage('localStorage');
ensureStorage('sessionStorage');

afterEach(() => {
  cleanup();
  window.localStorage?.clear();
  window.sessionStorage?.clear();
  vi.restoreAllMocks();
});
