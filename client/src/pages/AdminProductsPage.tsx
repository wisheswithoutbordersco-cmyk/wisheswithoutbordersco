import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  Globe,
  Package,
  Search,
  ExternalLink,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── Per-row export state ────────────────────────────────────────────────────
type ExportState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; gumroadUrl: string }
  | { status: "error"; message: string };

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 50;

  // Per-product export state keyed by product ID
  const [exportStates, setExportStates] = useState<Record<string, ExportState>>(
    {},
  );

  const { data, isLoading, error } = trpc.admin.listProducts.useQuery(
    { page, pageSize, search: search || undefined },
    { enabled: !!user && user.role === "admin" },
  );

  const exportMutation = trpc.admin.exportToGumroad.useMutation({
    onMutate: ({ productId }) => {
      setExportStates((prev) => ({
        ...prev,
        [productId]: { status: "loading" },
      }));
    },
    onSuccess: (result, { productId }) => {
      setExportStates((prev) => ({
        ...prev,
        [productId]: { status: "success", gumroadUrl: result.gumroadUrl },
      }));
    },
    onError: (err, { productId }) => {
      setExportStates((prev) => ({
        ...prev,
        [productId]: { status: "error", message: err.message },
      }));
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleExport(productId: string) {
    exportMutation.mutate({ productId });
  }

  // ── Auth guard ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <NavBar />
        <div className="flex items-center justify-center h-64 text-[#1a2744]">
          Loading…
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <NavBar />
        <div className="max-w-md mx-auto mt-24 text-center px-4">
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#e8dfc8]">
            <Globe className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-serif text-[#1a2744] mb-2">
              Admin Only
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              You need admin access to view this page.
            </p>
            <Link
              href="/"
              className="text-[#d4af37] hover:underline text-sm font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#1a2744] flex items-center gap-3">
              <Package className="w-8 h-8 text-[#d4af37]" />
              Product Command
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {data
                ? `${data.total} product${data.total !== 1 ? "s" : ""} in database`
                : "Loading…"}
            </p>
          </div>
          {/* Admin nav links */}
          <div className="flex items-center gap-4 flex-wrap text-sm font-semibold text-[#1a2744]">
            <Link
              href="/admin/orders"
              className="hover:text-[#d4af37] transition-colors"
            >
              → Orders
            </Link>
            <Link
              href="/admin/subscribers"
              className="hover:text-[#d4af37] transition-colors"
            >
              → Subscribers
            </Link>
            <Link
              href="/admin/cms"
              className="hover:text-[#d4af37] transition-colors"
            >
              → CMS Sync
            </Link>
          </div>
        </div>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products by name or description…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#e8dfc8] bg-white text-sm text-[#1a2744] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1a2744] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#243460] transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
              className="text-sm text-gray-500 hover:text-[#1a2744] px-3 py-2.5 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* ── Product Table ── */}
        <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Loading products…
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">
              Failed to load products.
            </div>
          ) : !data?.products?.length ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
              <Package className="w-8 h-8 text-[#d4af37] opacity-50" />
              <p>No products found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a2744] text-white/80 text-xs uppercase tracking-wide">
                      <th className="text-left px-4 py-3 font-semibold">
                        Product Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Country
                      </th>
                      <th className="text-right px-4 py-3 font-semibold">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Gumroad
                      </th>
                      <th className="text-center px-4 py-3 font-semibold">
                        Export
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product, idx) => {
                      const exportState = exportStates[product.id] ?? {
                        status: "idle",
                      };
                      // Prefer freshly-exported URL, then existing DB link
                      const gumroadUrl =
                        exportState.status === "success"
                          ? exportState.gumroadUrl
                          : product.gumroadLink ?? null;

                      return (
                        <tr
                          key={product.id}
                          className={
                            idx % 2 === 0 ? "bg-white" : "bg-[#faf8f3]"
                          }
                        >
                          {/* Product Name */}
                          <td
                            className="px-4 py-3 text-[#1a2744] font-medium max-w-[220px] truncate"
                            title={product.productName}
                          >
                            {product.productName}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 text-gray-600 text-xs capitalize">
                            {product.category}
                          </td>

                          {/* Country */}
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {product.country ?? (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3 text-[#1a2744] font-semibold text-right">
                            ${(product.price / 100).toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>

                          {/* Gumroad link (existing or freshly exported) */}
                          <td className="px-4 py-3">
                            {gumroadUrl ? (
                              <a
                                href={gumroadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[#d4af37] hover:underline text-xs font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </a>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>

                          {/* Export to Gumroad button */}
                          <td className="px-4 py-3 text-center">
                            <ExportButton
                              state={exportState}
                              onExport={() => handleExport(product.id)}
                              hasExistingLink={!!product.gumroadLink}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8dfc8]">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-sm text-[#1a2744] font-semibold disabled:opacity-30 hover:text-[#d4af37] transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="text-sm text-[#1a2744] font-semibold disabled:opacity-30 hover:text-[#d4af37] transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          This page is only visible to admin accounts.
        </p>
      </div>
    </div>
  );
}

// ── Export Button sub-component ──────────────────────────────────────────────
function ExportButton({
  state,
  onExport,
  hasExistingLink,
}: {
  state: ExportState;
  onExport: () => void;
  hasExistingLink: boolean;
}) {
  if (state.status === "loading") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Exporting…
      </span>
    );
  }

  if (state.status === "success") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
        <CheckCircle className="w-3.5 h-3.5" />
        Exported
      </span>
    );
  }

  if (state.status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs text-red-500 cursor-help"
        title={state.message}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Failed
      </span>
    );
  }

  // idle — show the button
  return (
    <button
      onClick={onExport}
      title={
        hasExistingLink
          ? "Re-export to Gumroad (will create a new listing)"
          : "Export this product to Gumroad"
      }
      className="inline-flex items-center gap-1.5 bg-[#1a2744] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#243460] transition-colors whitespace-nowrap"
    >
      <Upload className="w-3 h-3" />
      {hasExistingLink ? "Re-export" : "Export to Gumroad"}
    </button>
  );
}
