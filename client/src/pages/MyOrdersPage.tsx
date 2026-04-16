import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { Download, Loader2, Package, LogIn, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function MyOrdersPage() {
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  const { data, isLoading, error } = trpc.shop.myOrders.useQuery(undefined, {
    enabled: !!user,
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Package className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">
            My Orders
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Order History</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Access your purchased downloads anytime.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Not logged in */}
        {!userLoading && !user && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-[#d4af37]/20">
            <LogIn className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-serif text-[#1a2744] mb-3">
              Sign In to View Orders
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Log in to access your purchase history and download your files.
              Your downloads are linked to the email you used at checkout.
            </p>
            <p className="text-sm text-gray-500">
              If you purchased without an account, check the confirmation email you received
              or email us at{" "}
              <a
                href="mailto:info@wisheswithoutbordersco.com"
                className="text-[#d4af37] font-semibold hover:underline"
              >
                info@wisheswithoutbordersco.com
              </a>
            </p>
          </div>
        )}

        {/* Loading */}
        {(userLoading || isLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
            <p className="text-red-700 font-semibold">Failed to load orders. Please try again later.</p>
          </div>
        )}

        {/* No orders */}
        {user && data && data.orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-[#d4af37]/20">
            <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-serif text-[#1a2744] mb-3">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't made any purchases yet. Browse our collection to find the perfect card!
            </p>
            <Link
              href="/birthday"
              className="inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-6 py-3 rounded-full hover:bg-[#c49b2a] transition-colors"
            >
              Browse Cards
            </Link>
          </div>
        )}

        {/* Orders list */}
        {user && data && data.orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center mb-6">
              Showing {data.orders.length} order{data.orders.length !== 1 ? "s" : ""} for {user.email}
            </p>

            {data.orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {order.status === "paid" ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : order.status === "pending" ? (
                      <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <p className="font-semibold text-[#1a2744] truncate">{order.productName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>${(order.amountCents / 100).toFixed(2)}</span>
                    <span>·</span>
                    <span>{new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</span>
                    <span>·</span>
                    <span className={
                      order.status === "paid" ? "text-green-600 font-semibold" :
                      order.status === "pending" ? "text-yellow-600 font-semibold" :
                      "text-red-500 font-semibold"
                    }>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {order.downloadUrl ? (
                  <a
                    href={order.downloadUrl}
                    className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#c49b2a] text-[#1a2744] font-bold px-4 py-2 rounded-full text-sm transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                ) : order.status === "paid" ? (
                  <span className="text-xs text-gray-400 shrink-0">File unavailable</span>
                ) : null}
              </div>
            ))}

            <div className="text-center text-xs text-gray-400 mt-6">
              Download links are generated fresh each time you visit this page (valid for 24 hours).
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2744] border-t border-white/10 text-white/50 text-center py-6 text-xs mt-12">
        <p className="italic text-[#d4af37]/70 text-sm mb-3">Send a piece of home, back home.</p>
        All products are instant digital downloads · Print at home · wisheswithoutbordersco.com
      </footer>
    </div>
  );
}
