/**
 * LoadingGallery — shared loading / error / empty state component
 * for all DB-backed product pages.
 */
import { Loader2, AlertCircle, PackageOpen } from "lucide-react";

type Props = {
  isLoading: boolean;
  error: unknown;
  isEmpty: boolean;
  /** Label shown in empty state, e.g. "cards" or "products" */
  itemLabel?: string;
};

export function LoadingGallery({ isLoading, error, isEmpty, itemLabel = "products" }: Props) {
  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading {itemLabel}…</p>
        {/* Skeleton grid */}
        <div className="w-full max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
                <div className="bg-gray-200" style={{ aspectRatio: "3/4" }} />
                <div className="p-2 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 py-20 px-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-red-600 font-semibold text-sm">Failed to load {itemLabel}</p>
        <p className="text-gray-500 text-xs text-center max-w-md">{msg}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-[#1a2744] text-white text-xs font-semibold rounded-full hover:bg-[#243560] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 py-20 px-4">
        <PackageOpen className="w-10 h-10 text-gray-300" />
        <p className="text-gray-500 font-semibold text-sm">No {itemLabel} found</p>
        <p className="text-gray-400 text-xs">Check back soon — new designs are added regularly.</p>
      </div>
    );
  }

  return null;
}
