'use client';

import dynamic from 'next/dynamic';

const ForgotPasswordClient = dynamic(
  () => import('./_forgot-password-client'),
  { ssr: false, loading: () => null }
);

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
