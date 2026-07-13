'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function SignupToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      toast.success(decodeURIComponent(success), { duration: 4500 });
    }

    if (error) {
      toast.error(decodeURIComponent(error), { duration: 5500 });
    }
  }, [searchParams]);

  return null;
}
