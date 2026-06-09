'use client';

import dynamic from 'next/dynamic';

const RegisterClient = dynamic(
  () => import('./_register-client'),
  { ssr: false, loading: () => null }
);

export default function RegisterPage() {
  return <RegisterClient />;
}
