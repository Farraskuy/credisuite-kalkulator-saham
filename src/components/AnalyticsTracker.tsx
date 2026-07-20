'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch('/api/analytics/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer: document.referrer || 'Direct',
            path: window.location.pathname,
          }),
        });
      } catch {
        // Fail silently
      }
    };
    trackVisitor();
  }, []);

  return null;
}
