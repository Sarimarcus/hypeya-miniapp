'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const handleClose = () => {
    router.back(); // Navigate back to previous page
  };
  
  return <AdvancedSearch initialQuery={initialQuery} onClose={handleClose} />;
}
