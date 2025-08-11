'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

export default function EmotionCacheProvider({
  options,
  children,
}: {
  options?: Parameters<typeof createCache>[0];
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() => {
    const c = createCache({ key: 'mui', prepend: true, ...options });
    // compat = true pour l’App Router
    // (assure la compatibilité avec l’injection côté serveur)
    //// @ts-expect-error
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys((cache as any).inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values((cache as any).inserted).join(' '),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}