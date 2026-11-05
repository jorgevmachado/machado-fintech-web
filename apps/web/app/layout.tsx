import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@fintech/ui/styles.css';

import enUS from '../src/locales/en-US.json';
import esUE from '../src/locales/es-UE.json';
import ptBR from '../src/locales/pt-BR.json';

import "./globals.css";

import { LoadingProvider ,UIProvider ,UserProvider } from '@fintech/ui';
import AppShell from '../src/app-shell/AppShell';
import { SessionExpirationHandler } from '../src/features/auth';
import { getServerSession, getAuthenticatedUserBootstrap } from '../src/server/auth';
import { redirect } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comprovante | Gestão Financeira",
  description: "Organize comprovantes e acompanhe seus pagamentos em um só lugar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  const { initialUser } = await getAuthenticatedUserBootstrap(
    session.isAuthenticated,
    session.token
  );

  if( session.isAuthenticated && !initialUser) {
    redirect('/auth/logout');
  }

  const isAuthenticated = session.isAuthenticated && Boolean(initialUser);

  return (
    <html
      lang="en-US"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
    <body className="min-h-full flex flex-col">
    <UIProvider locales={{ "en-US": enUS, "es-UE": esUE, "pt-BR": ptBR }}>
      <LoadingProvider service={{ variant: 'circle', size: 'lg' }} pageRender={{ variant: 'bar', size: 'md', tone: 'warning', progress: true }}>
        <UserProvider user={initialUser}>
          <AppShell isAuthenticated={isAuthenticated}>
            <SessionExpirationHandler />
            {children}
          </AppShell>
        </UserProvider>
      </LoadingProvider>
    </UIProvider>
    </body>
    </html>
  );
}
