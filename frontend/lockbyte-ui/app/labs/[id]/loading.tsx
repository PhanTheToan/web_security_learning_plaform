
export default function LabDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="h-5 w-1/2 bg-gray-700 rounded-md animate-pulse mb-6" />

      {/* Title */}
      <div className="h-12 w-3/4 bg-gray-700 rounded-md animate-pulse mb-4" />

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <div className="h-6 w-24 bg-gray-700 rounded-md animate-pulse" />
        <div className="h-6 w-20 bg-gray-700 rounded-md animate-pulse" />
        <div className="h-6 w-28 bg-gray-700 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="h-48 bg-gray-800/50 rounded-xl border border-white/10 animate-pulse p-6" />
          {/* CTA Button */}
          <div className="h-12 w-1/2 bg-purple-600 rounded-md animate-pulse" />
          {/* Accordions */}
          <div className="h-16 bg-gray-800/50 rounded-xl border border-white/10 animate-pulse" />
          <div className="h-16 bg-gray-800/50 rounded-xl border border-white/10 animate-pulse" />
          <div className="h-16 bg-gray-800/50 rounded-xl border border-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
