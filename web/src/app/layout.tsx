import type { CSSProperties } from 'react';
import { MuiProvider, QueryProvider } from '@/components';
import { theme } from '../../theme';

const divStyle: CSSProperties = { height: '100dvh', backgroundColor: theme.grey.light };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <QueryProvider>
          <MuiProvider>
            <div style={divStyle}>{children}</div>
          </MuiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
