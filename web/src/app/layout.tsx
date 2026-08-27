import type { CSSProperties } from 'react';
import { AmplifyProvider, MuiProvider, QueryProvider } from '@/components';
import { AppHeader } from '@/features/app-header';
import { theme } from '../../theme';

const divStyle: CSSProperties = { height: '100dvh', backgroundColor: theme.grey.light };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <AmplifyProvider>
          <QueryProvider>
            <MuiProvider>
              <div style={divStyle}>
                <AppHeader />
                {children}
              </div>
            </MuiProvider>
          </QueryProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
