import { MuiProvider, QueryProvider } from '@/components';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <QueryProvider>
          <MuiProvider>{children}</MuiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
