'use client';

import dynamic from 'next/dynamic';

const LoginClient = dynamic(
  () => import('./_login-client'),
  { ssr: false, loading: () => null }
);

export default function LoginPage() {
  return <LoginClient />;
}
