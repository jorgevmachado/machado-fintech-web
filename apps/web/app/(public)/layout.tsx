import React from 'react';
import { redirect } from 'next/navigation';

import { getServerSession } from '../../src/server/auth';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await getServerSession();

  if (session.isAuthenticated) {
    redirect('/home');
  }

  return children;
}
