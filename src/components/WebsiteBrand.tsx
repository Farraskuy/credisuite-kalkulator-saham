'use client';

import { useEffect, useState } from 'react';

interface Props {
  fallback?: string;
  suffix?: string;
}

export default function WebsiteBrand({ fallback = 'KalkulatorSaham.id', suffix = '' }: Props) {
  const [hostname, setHostname] = useState(fallback);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
    }
  }, []);

  return <span>{hostname}{suffix}</span>;
}
