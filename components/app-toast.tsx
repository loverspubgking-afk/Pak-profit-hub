'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function AppToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read success/error from URL (used by server actions)
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      toast.success(decodeURIComponent(success), {
        duration: 5200,
        description: 'Action completed',
        action: {
          label: 'OK',
          onClick: () => {},
        },
      });
    }

    if (error) {
      toast.error(decodeURIComponent(error), {
        duration: 6200,
      });
    }

    // Clean up query params visually (optional but keeps URLs clean)
    if (success || error) {
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return null;
}
