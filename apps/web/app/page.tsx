import { redirect } from 'next/navigation';

import { getServerSession } from '../src/server/auth';

export default async function Home() {
  const session = await getServerSession();

  if(session.isAuthenticated) {
    redirect('/home');
  }
  redirect('/join');
}
