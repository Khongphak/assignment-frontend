import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime } from './time';

describe('formatRelativeTime', () => {
  const BASE = new Date('2026-08-20T10:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns seconds when diff < 60s', () => {
    const ts = new Date(BASE - 30 * 1000).toISOString();
    expect(formatRelativeTime(ts)).toBe('30 วินาทีที่แล้ว');
  });

  it('returns 0 วินาทีที่แล้ว for a future timestamp', () => {
    const ts = new Date(BASE + 5000).toISOString();
    expect(formatRelativeTime(ts)).toBe('0 วินาทีที่แล้ว');
  });

  it('returns minutes when 60s ≤ diff < 60min', () => {
    const ts = new Date(BASE - 3 * 60 * 1000).toISOString();
    expect(formatRelativeTime(ts)).toBe('3 นาทีที่แล้ว');
  });

  it('returns hours when 1h ≤ diff < 24h', () => {
    const ts = new Date(BASE - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(ts)).toBe('2 ชั่วโมงที่แล้ว');
  });

  it('returns days when diff ≥ 24h', () => {
    const ts = new Date(BASE - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(ts)).toBe('3 วันที่แล้ว');
  });
});
