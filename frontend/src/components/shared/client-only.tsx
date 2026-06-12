'use client';

import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export function ClientOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
