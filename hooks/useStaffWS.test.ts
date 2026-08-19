import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStaffWS } from './useStaffWS';
import * as tokenModule from '@/lib/auth/token';

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }

  send(_data: string) {}

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close', { code: 1000, wasClean: true }));
  }

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event('open'));
  }

  simulateMessage(data: unknown) {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }));
  }

  simulateError() {
    this.onerror?.(new Event('error'));
  }

  simulateClose(code = 1000) {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close', { code, wasClean: code === 1000 }));
  }

  static instances: MockWebSocket[] = [];
  static reset() { MockWebSocket.instances = []; }
}

vi.stubGlobal('WebSocket', MockWebSocket);

beforeEach(() => {
  MockWebSocket.reset();
  vi.stubEnv('NEXT_PUBLIC_WS_BASE_URL', 'ws://localhost:8080');
  vi.spyOn(tokenModule, 'getToken').mockReturnValue('test-jwt-token');
  vi.spyOn(tokenModule, 'clearToken').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('useStaffWS', () => {
  it('sets tokenMissing when no token', () => {
    vi.spyOn(tokenModule, 'getToken').mockReturnValue(null);
    const { result } = renderHook(() => useStaffWS());
    expect(result.current.tokenMissing).toBe(true);
    expect(MockWebSocket.instances).toHaveLength(0);
  });

  it('connects to correct URL with token', () => {
    renderHook(() => useStaffWS());
    expect(MockWebSocket.instances[0]?.url).toBe('ws://localhost:8080/ws/staff?token=test-jwt-token');
  });

  it('transitions to connected on ws open', () => {
    const { result } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateOpen();
    });

    expect(result.current.wsStatus).toBe('connected');
  });

  it('transitions to disconnected on ws error', () => {
    const { result } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateError();
    });

    expect(result.current.wsStatus).toBe('disconnected');
  });

  it('transitions to disconnected on ws close', () => {
    const { result } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateOpen();
    });
    act(() => {
      ws.simulateClose();
    });

    expect(result.current.wsStatus).toBe('disconnected');
  });

  it('clears token and sets tokenMissing on close code 1008', () => {
    const { result } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateClose(1008);
    });

    expect(tokenModule.clearToken).toHaveBeenCalled();
    expect(result.current.tokenMissing).toBe(true);
  });

  it('upserts sessions by session_id on incoming messages', () => {
    const { result } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    const msg1 = {
      type: 'form_update',
      session_id: 'sess-001',
      status: 'filling',
      data: { first_name_th: 'สมชาย' },
      timestamp: '2026-08-20T10:00:00Z',
    };
    const msg2 = {
      type: 'form_update',
      session_id: 'sess-002',
      status: 'submitted',
      data: { first_name_th: 'มาเรีย' },
      timestamp: '2026-08-20T10:01:00Z',
    };
    const msg1Updated = { ...msg1, status: 'submitted', timestamp: '2026-08-20T10:02:00Z' };

    act(() => {
      ws.simulateOpen();
      ws.simulateMessage(msg1);
      ws.simulateMessage(msg2);
    });

    expect(result.current.sessions).toHaveLength(2);

    act(() => {
      ws.simulateMessage(msg1Updated);
    });

    // sess-001 updated, not duplicated
    expect(result.current.sessions).toHaveLength(2);
    const updated = result.current.sessions.find((s) => s.session_id === 'sess-001');
    expect(updated?.status).toBe('submitted');
  });

  it('closes WS on unmount', () => {
    const { unmount } = renderHook(() => useStaffWS());
    const ws = MockWebSocket.instances[0]!;

    unmount();

    expect(ws.readyState).toBe(MockWebSocket.CLOSED);
  });
});
