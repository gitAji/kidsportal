"use client";
import { useEffect, useRef } from 'react';
import { useChild } from '../../providers/ChildProvider';
import { addTimeUsage } from '../../utils/firestoreService';
import { getDateKey } from '../../utils/timeLimits';

const FLUSH_INTERVAL_MS = 30000; // sync accumulated active time every 30s

// Invisible — mounted once in the learning-zone layout. Accumulates time
// spent with the tab actually visible (not just open) and periodically
// flushes it to the child's daily usage total, which the level/subject
// grids use to decide when to show the time-limit block.
export default function TimeTracker() {
  const { childUser } = useChild();
  const activeSecondsRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!childUser?.id) return;

    const tick = () => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      if (document.visibilityState === 'visible' && elapsed > 0 && elapsed < 120) {
        activeSecondsRef.current += elapsed;
      }
    };

    const flush = () => {
      const seconds = activeSecondsRef.current;
      if (seconds < 1) return;
      activeSecondsRef.current = 0;
      addTimeUsage(childUser.id, getDateKey(), seconds / 60).catch((err) => {
        console.error('Failed to record time usage', err);
      });
    };

    const tickInterval = setInterval(tick, 5000);
    const flushInterval = setInterval(() => { tick(); flush(); }, FLUSH_INTERVAL_MS);

    const handleVisibility = () => { lastTickRef.current = Date.now(); };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(tickInterval);
      clearInterval(flushInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      tick();
      flush();
    };
  }, [childUser?.id]);

  return null;
}
