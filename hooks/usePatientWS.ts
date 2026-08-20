'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { PatientFormData } from '@/types/patient';

export type WsStatus = 'connecting' | 'connected' | 'disconnected';

const KEEP_ALIVE_INTERVAL_MS = 20_000;
const DEBOUNCE_MS = 500;

export function usePatientWS(hospitalCode: string) {
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const latestDataRef = useRef<PatientFormData | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hospitalCode) {
      setWsStatus('disconnected');
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/patient?hospital_code=${hospitalCode}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data) as { type: string; session_id?: string };
      if (msg.type === 'connected' && msg.session_id) {
        sessionIdRef.current = msg.session_id;
        setWsStatus('connected');

        // Keep-alive: re-send latest form data every 20s to prevent 30s inactivity timeout
        keepAliveRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN && latestDataRef.current) {
            ws.send(
              JSON.stringify({ type: 'form_update', status: 'filling', data: latestDataRef.current })
            );
          }
        }, KEEP_ALIVE_INTERVAL_MS);
      }
    };

    ws.onerror = () => {
      setWsStatus('disconnected');
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      ws.close();
    };
  }, [hospitalCode]);

  const sendFillingDebounced = useCallback((data: PatientFormData) => {
    latestDataRef.current = data;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'form_update', status: 'filling', data }));
      }
    }, DEBOUNCE_MS);
  }, []);

  const sendSubmitted = useCallback((data: PatientFormData) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    latestDataRef.current = data;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'form_update', status: 'submitted', data }));
    }
  }, []);

  return { wsStatus, sendFillingDebounced, sendSubmitted };
}
