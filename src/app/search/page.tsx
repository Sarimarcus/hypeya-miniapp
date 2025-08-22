'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const handleClose = () => {
    router.back(); // Navigate back to previous page
  };

  return <AdvancedSearch initialQuery={initialQuery} onClose={handleClose} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Cargando búsqueda...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
