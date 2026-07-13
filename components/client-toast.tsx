'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function ClientToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      toast.success(decodeURIComponent(success), {
        duration: 4800,
        description: 'Action completed successfully',
      });
    }

    if (error) {
      toast.error(decodeURIComponent(error), {
        duration: 6200,
      });
    }
  }, [searchParams]);

  return null;
}
