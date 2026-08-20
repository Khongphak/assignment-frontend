'use client';

import { useEffect, useRef, useState } from 'react';
import { getToken, setToken, clearToken } from '@/lib/auth/token';
import { refreshAction } from '@/app/actions/auth';

const TOKEN_TTL_MS = 900 * 1000;         // 15 min
const REFRESH_BEFORE_MS = 60 * 1000;     // refresh 60 s before expiry

export function useTokenRefresh() {
  const [tokenMissing, setTokenMissing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (getToken() === null) {
        const result = await refreshAction();
        if (!result) {
          setTokenMissing(true);
          setReady(true);
          return;
        }
        setToken(result.access_token);
      }

      setReady(true);

      intervalRef.current = setInterval(async () => {
        const result = await refreshAction();
        if (result) {
          setToken(result.access_token);
        } else {
          clearToken();
          setTokenMissing(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, TOKEN_TTL_MS - REFRESH_BEFORE_MS);
    }

    init();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { tokenMissing, ready };
}
