import { MuiProvider } from '@/components';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
