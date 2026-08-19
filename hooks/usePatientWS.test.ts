import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePatientWS } from './usePatientWS';

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  sent: string[] = [];
  onopen: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close', { code: 1000, wasClean: true }));
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
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('usePatientWS', () => {
  it('starts in connecting state', () => {
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    expect(result.current.wsStatus).toBe('connecting');
  });

  it('connects to correct URL with hospital_code', () => {
    renderHook(() => usePatientWS('HOSP01'));
    expect(MockWebSocket.instances[0]?.url).toBe('ws://localhost:8080/ws/patient?hospital_code=HOSP01');
  });

  it('transitions to connected when server sends connected ack', () => {
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateMessage({ type: 'connected', session_id: 'abc-123' });
    });

    expect(result.current.wsStatus).toBe('connected');
  });

  it('transitions to disconnected on WS error', () => {
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateError();
    });

    expect(result.current.wsStatus).toBe('disconnected');
  });

  it('transitions to disconnected on WS close', () => {
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateMessage({ type: 'connected', session_id: 'abc-123' });
    });
    act(() => {
      ws.simulateClose();
    });

    expect(result.current.wsStatus).toBe('disconnected');
  });

  it('disconnected immediately when hospitalCode is empty', () => {
    const { result } = renderHook(() => usePatientWS(''));
    expect(result.current.wsStatus).toBe('disconnected');
    expect(MockWebSocket.instances).toHaveLength(0);
  });

  it('sendFillingDebounced sends form_update with status filling after 500ms', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateMessage({ type: 'connected', session_id: 'abc-123' });
      ws.readyState = MockWebSocket.OPEN;
    });

    const data = { first_name_th: 'สมชาย' } as Parameters<typeof result.current.sendFillingDebounced>[0];

    act(() => {
      result.current.sendFillingDebounced(data);
    });

    expect(ws.sent).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(ws.sent).toHaveLength(1);
    const sent = JSON.parse(ws.sent[0]!);
    expect(sent.type).toBe('form_update');
    expect(sent.status).toBe('filling');
    expect(sent.data).toMatchObject({ first_name_th: 'สมชาย' });
  });

  it('sendSubmitted sends immediately with status submitted', () => {
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateMessage({ type: 'connected', session_id: 'abc-123' });
      ws.readyState = MockWebSocket.OPEN;
    });

    const data = { first_name_th: 'สมชาย' } as Parameters<typeof result.current.sendSubmitted>[0];

    act(() => {
      result.current.sendSubmitted(data);
    });

    expect(ws.sent).toHaveLength(1);
    const sent = JSON.parse(ws.sent[0]!);
    expect(sent.type).toBe('form_update');
    expect(sent.status).toBe('submitted');
  });

  it('closes WS on unmount', () => {
    const { unmount } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    unmount();

    expect(ws.readyState).toBe(MockWebSocket.CLOSED);
  });

  it('keep-alive sends every 20s after connected', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePatientWS('HOSP01'));
    const ws = MockWebSocket.instances[0]!;

    act(() => {
      ws.simulateMessage({ type: 'connected', session_id: 'abc-123' });
      ws.readyState = MockWebSocket.OPEN;
    });

    const data = { first_name_th: 'ทดสอบ' } as Parameters<typeof result.current.sendFillingDebounced>[0];
    act(() => {
      result.current.sendFillingDebounced(data);
      vi.advanceTimersByTime(500); // flush debounce
    });
    ws.sent = []; // ignore the debounced send

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    expect(ws.sent).toHaveLength(1);
    const sent = JSON.parse(ws.sent[0]!);
    expect(sent.type).toBe('form_update');
    expect(sent.status).toBe('filling');
  });
});
