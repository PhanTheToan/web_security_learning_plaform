
export default function LabsLoading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-12 text-center">
        <div className="h-12 bg-gray-700 rounded-md w-1/3 mx-auto animate-pulse" />
        <div className="h-6 bg-gray-700 rounded-md w-2/3 mx-auto mt-4 animate-pulse" />
      </div>
      <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10 mb-8">
        <div className="h-10 w-full bg-gray-700 rounded-md animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
            <div className="h-6 w-3/4 mb-2 bg-gray-700 rounded-md animate-pulse" />
            <div className="h-4 w-1/2 mb-4 bg-gray-700 rounded-md animate-pulse" />
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-5 w-16 bg-gray-700 rounded-md animate-pulse" />
              <div className="h-5 w-20 bg-gray-700 rounded-md animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
