'use client';

import { useEffect, useRef, useState } from 'react';
import { getToken, clearToken } from '@/lib/auth/token';
import type { StaffSessionMessage } from '@/types/staff';

export type WsStatus = 'connecting' | 'connected' | 'disconnected';

export function useStaffWS() {
  const [sessions, setSessions] = useState<StaffSessionMessage[]>([]);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const [tokenMissing, setTokenMissing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setTokenMissing(true);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/staff?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus('connected');
    };

    ws.onmessage = (e) => {
      const msg: StaffSessionMessage = JSON.parse(e.data);
      setSessions((prev) => {
        const map = new Map(prev.map((s) => [s.session_id, s]));
        map.set(msg.session_id, msg);
        return Array.from(map.values());
      });
    };

    ws.onerror = () => {
      setWsStatus('disconnected');
    };

    ws.onclose = (e) => {
      setWsStatus('disconnected');
      // WS close code 1008 = Policy Violation — token was rejected before upgrade
      if (e.code === 1008) {
        clearToken();
        setTokenMissing(true);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return { sessions, wsStatus, tokenMissing };
}
