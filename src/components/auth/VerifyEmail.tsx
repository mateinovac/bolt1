import React from 'react';
import { Mail } from 'lucide-react';
import { AuthLayout } from './AuthLayout';

export function VerifyEmail() {
  return (
    <AuthLayout
      title="Check your email"
      subtitle="We sent you a verification link. Please check your email to continue."
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 mb-4">
          <Mail className="w-6 h-6 text-violet-400" />
        </div>
        
        <p className="text-gray-400 mb-6">
          Click the link in the email to verify your account. If you don't see it, check your spam folder.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="text-violet-400 hover:text-violet-300 text-sm"
        >
          Didn't receive the email? Click to resend
        </button>
      </div>
    </AuthLayout>
  );
}
