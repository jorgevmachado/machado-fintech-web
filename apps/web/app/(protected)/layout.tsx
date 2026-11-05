import React from 'react';
import { redirect } from 'next/navigation';

import { getServerSession } from '../../src/server/auth';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    redirect('/join');
  }

  return children;
}
