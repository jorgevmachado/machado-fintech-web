import { Suspense } from 'react';

import { JoinPage } from '../../../src/features/auth';

export default function JoinRouterPage() {
  return (
    <Suspense fallback={null}>
      <JoinPage/>
    </Suspense>
  )
}