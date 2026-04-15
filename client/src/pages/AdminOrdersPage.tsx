import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Download, ShoppingBag, DollarSign, Globe, TrendingUp } from "lucide-react";

type StatusFilter = "all" | "paid" | "pending" | "failed";

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  paid:    { label: "Paid",    classes: "bg-green-100 text-green-700" },
  pending: { label: "Pending", classes: "bg-yellow-100 text-yellow-700" },
  failed:  { label: "Failed",  classes: "bg-red-100 text-red-700" },
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const pageSize = 50;

  const { data, isLoading, error } = trpc.shop.getOrders.useQuery(
    { page, pageSize, status: statusFilter },
    { enabled: !!user && user.role === "admin" }
  );

  function downloadCsv() {
    if (!data?.orders?.length) return;
    const header = "ID,Customer Email,Product,Amount,Status,Date\n";
    const rows = data.orders
      .map((o) =>
        `${o.id},"${o.customerEmail ?? ""}","${o.productName}","$${(o.amountCents / 100).toFixed(2)}","${o.status}","${new Date(o.createdAt).toLocaleString()}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-page${page}-${statusFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <NavBar />
        <div className="flex items-center justify-center h-64 text-[#0A1A2F]">Loading…</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <NavBar />
        <div className="max-w-md mx-auto mt-24 text-center px-4">
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#e8dfc8]">
            <Globe className="w-10 h-10 text-[#C9A86A] mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-serif text-[#0A1A2F] mb-2">Admin Only</h1>
            <p className="text-gray-500 text-sm mb-6">You need admin access to view this page.</p>
            <Link href="/" className="text-[#C9A86A] hover:underline text-sm font-semibold">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
  const totalRevenue = data ? (data.totalRevenueCents / 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#0A1A2F] flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#C9A86A]" />
              Orders Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {data ? `${data.total} total order${data.total !== 1 ? "s" : ""}` : "Loading…"}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Admin nav links */}
            <Link href="/admin/subscribers" className="text-sm text-[#0A1A2F] font-semibold hover:text-[#C9A86A] transition-colors">
              → Subscribers
            </Link>
            <button
              onClick={downloadCsv}
              disabled={!data?.orders?.length}
              className="flex items-center gap-2 bg-[#0A1A2F] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#243460] transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-[#e8dfc8] shadow-sm flex items-center gap-4">
              <div className="bg-[#F8F5EF] rounded-full p-2">
                <TrendingUp className="w-5 h-5 text-[#C9A86A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0A1A2F]">{data.total}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#e8dfc8] shadow-sm flex items-center gap-4">
              <div className="bg-green-50 rounded-full p-2">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0A1A2F]">${totalRevenue}</p>
                <p className="text-xs text-gray-500">Total Revenue (Paid)</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#e8dfc8] shadow-sm flex items-center gap-4">
              <div className="bg-green-50 rounded-full p-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0A1A2F]">
                  {data.orders.filter((o) => o.status === "paid").length}
                </p>
                <p className="text-xs text-gray-500">Paid (this page)</p>
              </div>
            </div>
          </div>
        )}

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(["all", "paid", "pending", "failed"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-[#0A1A2F] text-white"
                  : "bg-white text-[#0A1A2F] border border-[#e8dfc8] hover:border-[#C9A86A]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading orders…</div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">Failed to load orders.</div>
          ) : !data?.orders?.length ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
              <ShoppingBag className="w-8 h-8 text-[#C9A86A] opacity-50" />
              <p>No orders found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0A1A2F] text-white/80 text-xs uppercase tracking-wide">
                      <th className="text-left px-4 py-3 font-semibold">#</th>
                      <th className="text-left px-4 py-3 font-semibold">Customer Email</th>
                      <th className="text-left px-4 py-3 font-semibold">Product</th>
                      <th className="text-left px-4 py-3 font-semibold">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#faf8f3]"}
                      >
                        <td className="px-4 py-3 text-gray-400 text-xs">{order.id}</td>
                        <td className="px-4 py-3 text-[#0A1A2F] font-medium">
                          {order.customerEmail ?? <span className="text-gray-400 italic">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={order.productName}>
                          {order.productName}
                        </td>
                        <td className="px-4 py-3 text-[#0A1A2F] font-semibold">
                          ${(order.amountCents / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_LABELS[order.status]?.classes ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[order.status]?.label ?? order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8dfc8]">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-sm text-[#0A1A2F] font-semibold disabled:opacity-30 hover:text-[#C9A86A] transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="text-sm text-[#0A1A2F] font-semibold disabled:opacity-30 hover:text-[#C9A86A] transition-colors"
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
