import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Download, Mail, Globe, Users } from "lucide-react";

export default function AdminSubscribersPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data, isLoading, error } = trpc.shop.getSubscribers.useQuery(
    { page, pageSize },
    { enabled: !!user && user.role === "admin" }
  );

  function downloadCsv() {
    if (!data?.subscribers?.length) return;
    const header = "Email,Source,Signed Up\n";
    const rows = data.subscribers
      .map((s) => `"${s.email}","${s.source ?? ""}","${new Date(Number(s.createdAt)).toLocaleString()}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <NavBar />
        <div className="flex items-center justify-center h-64 text-[#1a2744]">Loading…</div>
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
            <h1 className="text-2xl font-bold font-serif text-[#1a2744] mb-2">Admin Only</h1>
            <p className="text-gray-500 text-sm mb-6">You need admin access to view this page.</p>
            <Link href="/" className="text-[#d4af37] hover:underline text-sm font-semibold">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#1a2744] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#d4af37]" />
              Newsletter Subscribers
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {data ? `${data.total} total subscriber${data.total !== 1 ? "s" : ""}` : "Loading…"}
            </p>
          </div>
          <button
            onClick={downloadCsv}
            disabled={!data?.subscribers?.length}
            className="flex items-center gap-2 bg-[#1a2744] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#243460] transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Subscribers",
                value: data.total,
                icon: <Users className="w-5 h-5 text-[#d4af37]" />,
              },
              {
                label: "From Order Success",
                value: data.subscribers.filter((s) => s.source === "order_success").length,
                icon: <Mail className="w-5 h-5 text-[#d4af37]" />,
                note: "this page",
              },
              {
                label: "From Homepage Footer",
                value: data.subscribers.filter((s) => s.source === "homepage_footer").length,
                icon: <Globe className="w-5 h-5 text-[#d4af37]" />,
                note: "this page",
              },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#e8dfc8] shadow-sm flex items-center gap-4">
                <div className="bg-[#f5f0e8] rounded-full p-2">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-[#1a2744]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading subscribers…</div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">Failed to load subscribers.</div>
          ) : !data?.subscribers?.length ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
              <Mail className="w-8 h-8 text-[#d4af37] opacity-50" />
              <p>No subscribers yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a2744] text-white/80 text-xs uppercase tracking-wide">
                      <th className="text-left px-5 py-3 font-semibold">#</th>
                      <th className="text-left px-5 py-3 font-semibold">Email</th>
                      <th className="text-left px-5 py-3 font-semibold">Source</th>
                      <th className="text-left px-5 py-3 font-semibold">Signed Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscribers.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#faf8f3]"}
                      >
                        <td className="px-5 py-3 text-gray-400">{(page - 1) * pageSize + idx + 1}</td>
                        <td className="px-5 py-3 text-[#1a2744] font-medium">{sub.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              sub.source === "homepage_footer"
                                ? "bg-blue-100 text-blue-700"
                                : sub.source === "order_success"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {sub.source === "homepage_footer"
                              ? "Homepage Footer"
                              : sub.source === "order_success"
                              ? "Order Success"
                              : sub.source ?? "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {new Date(Number(sub.createdAt)).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
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
