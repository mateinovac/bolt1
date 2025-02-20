import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SignUpForm } from '../../components/auth/SignUpForm';

export function SignUpPage() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Sign up to get started with our platform"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
