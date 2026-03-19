import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stockly - Gestão de Ferramentas',
  description: 'Sistema de gerenciamento de ferramentas para canteiro de obras.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50`} suppressHydrationWarning>
        <ErrorBoundary>
          <AppProvider>
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
