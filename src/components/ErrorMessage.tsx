import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
}

export function ErrorMessage({ 
  title = "Something went wrong",
  message = "If this issue persists please contact us at support@cheatcopy.tech"
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-[#2B1316] border border-[#4D2B2B] p-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#F87171]" />
        <div className="flex-1">
          <p className="text-[#F3F4F6] text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
