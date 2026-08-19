import { describe, it, expect } from 'vitest';
import { getMockSessions } from './staffSessions';

describe('getMockSessions', () => {
  it('returns a non-empty array', () => {
    expect(getMockSessions().length).toBeGreaterThan(0);
  });

  it('every session has required WS contract fields', () => {
    for (const session of getMockSessions()) {
      expect(session.type).toBe('form_update');
      expect(typeof session.session_id).toBe('string');
      expect(['filling', 'submitted', 'inactive']).toContain(session.status);
      expect(typeof session.timestamp).toBe('string');
      // timestamp should parse to a valid date
      expect(new Date(session.timestamp).toISOString()).toBe(session.timestamp.replace('Z', '.000Z').replace('.000Z', 'Z') || session.timestamp);
    }
  });

  it('inactive sessions have data: null', () => {
    const inactive = getMockSessions().filter((s) => s.status === 'inactive');
    expect(inactive.length).toBeGreaterThan(0);
    for (const session of inactive) {
      expect(session.data).toBeNull();
    }
  });

  it('active sessions (filling / submitted) have non-null data', () => {
    const active = getMockSessions().filter((s) => s.status !== 'inactive');
    expect(active.length).toBeGreaterThan(0);
    for (const session of active) {
      expect(session.data).not.toBeNull();
    }
  });

  it('all session_ids are unique', () => {
    const ids = getMockSessions().map((s) => s.session_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('timestamps are recent ISO strings', () => {
    const sessions = getMockSessions();
    const now = Date.now();
    for (const session of sessions) {
      const ts = new Date(session.timestamp).getTime();
      // Each mock timestamp should be within the last 2 hours
      expect(ts).toBeGreaterThan(now - 2 * 60 * 60 * 1000);
      expect(ts).toBeLessThanOrEqual(now);
    }
  });
});
