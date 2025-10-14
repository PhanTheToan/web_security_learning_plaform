import { Skeleton } from '@/components/ui/skeleton';

export default function TopicsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Header Skeleton */}
      <header>
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="mt-2 h-6 w-1/3" />
      </header>

      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md hidden md:inline" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-4 w-1/2" />
            <div className="flex justify-end mt-4">
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}