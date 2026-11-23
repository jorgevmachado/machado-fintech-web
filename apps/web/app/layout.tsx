import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@fintech/ui/styles.css';

import enUS from '../src/locales/en-US.json';
import esUE from '../src/locales/es-UE.json';
import ptBR from '../src/locales/pt-BR.json';

import "./globals.css";

import { LoadingProvider ,UIProvider ,UserProvider } from '@fintech/ui';
// Subpath puro (sem `'use client'`): importar estes consts do barrel
// `@fintech/ui` os transformaria em referências de cliente e a interpolação
// abaixo sairia como `undefined` no HTML servido.
import { DEFAULT_THEME ,THEME_STORAGE_KEY } from '@fintech/ui/theme';
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
  title: "Fintech | Gestão Financeira",
  description: "Organize suas finanças e acompanhe seus pagamentos em um só lugar.",
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
    // `suppressHydrationWarning`: o script abaixo escreve `data-theme` no
    // `<html>` antes da hidratação e o servidor não emite esse atributo. Sem
    // isso o React 19 acusa mismatch de atributo em todo load. É o padrão
    // canônico de tema no Next.
    <html
      lang="en-US"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
    <head>
      {/*
        * Aplica o tema antes do primeiro paint. Sem este script o `data-theme`
        * só existe depois da hidratação (o `Navigation` o escreve num efeito),
        * então o app abria claro e virava escuro — e o `body` ficava branco até
        * o JS rodar.
        *
        * Precisa ser `<script>` inline bloqueante: `next/script` com
        * `beforeInteractive` só enfileira em `self.__next_s`, que o runtime do
        * Next executa depois de carregar — tarde demais para evitar o flash.
        * O `<head>` manual aqui não carrega `<title>`/`<meta>`: esses seguem
        * vindo da Metadata API, que o Next mescla neste mesmo `<head>`.
        *
        * O fallback é `DEFAULT_THEME`, não "não faz nada": o shell abre em dark
        * (`AppShell` passa `variant="dark"`) e só grava a preferência quando o
        * usuário troca o tema. Sem o fallback, a primeira visita — o caso mais
        * comum — continuaria piscando claro.
        */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:${JSON.stringify(DEFAULT_THEME)}}catch(e){document.documentElement.dataset.theme=${JSON.stringify(DEFAULT_THEME)}}`,
        }}
      />
    </head>
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
