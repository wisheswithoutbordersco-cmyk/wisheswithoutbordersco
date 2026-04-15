import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { CheckCircle, Download, ArrowRight, Loader2, Mail, Home, ShoppingCart, RefreshCw } from "lucide-react";

export default function OrderSuccessPage() {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const checkoutMutation = trpc.shop.createCheckout.useMutation();
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const subscribeMutation = trpc.shop.subscribeNewsletter.useMutation();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      const result = await subscribeMutation.mutateAsync({ email: emailInput.trim(), source: "order_success" });
      setEmailSubmitted(true);
      toast.success(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  // Parse query params
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id") ?? "";
  const productsParam = searchParams.get("products") ?? "";

  // Pick the first purchased product for related suggestions
  const firstProductId = productsParam.split(",")[0] ?? "";

  const { data: relatedData } = trpc.shop.getRelatedProducts.useQuery(
    { productId: firstProductId },
    { enabled: !!firstProductId }
  );

  async function handleRelatedBuy(productId: string, productName: string, price: number) {
    setBuyingId(productId);
    try {
      const origin = window.location.origin;
      const result = await checkoutMutation.mutateAsync({
        productId,
        cartItems: [{ productId, name: productName, price }],
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}/`,
      });
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Redirecting to secure checkout...");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setBuyingId(null);
    }
  }

  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [cleared, clearCart]);

  const { data, isLoading, error } = trpc.shop.verifyPayment.useQuery(
    { sessionId, products: productsParam || undefined },
    {
      enabled: !!sessionId,
      retry: 3,
      retryDelay: 1000,
    }
  );

  if (!sessionId) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500">No order found.</p>
            <Link href="/" className="mt-4 inline-block text-[#C9A86A] hover:underline">
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-[#F8F5EF]">
        {/* Hero */}
        <div className="bg-[#0A1A2F] text-white py-16 px-4 text-center">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#C9A86A]" />
              <h1 className="text-2xl font-bold font-serif">Confirming your order...</h1>
              <p className="text-white/70 mt-2">Please wait while we verify your payment with Stripe.</p>
            </>
          ) : error || !data?.success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold font-serif">Payment Received!</h1>
              <p className="text-white/70 mt-2 max-w-md mx-auto">
                Your payment was processed. If your download links don't appear below,
                please email us at{" "}
                <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#C9A86A] hover:underline">
                  info@wisheswithoutbordersco.com
                </a>{" "}
                and we'll send your files right away.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold font-serif mb-2">
                Thank You for Your Order!
              </h1>
              <p className="text-[#C9A86A] text-lg font-semibold">
                Your digital downloads are ready below
              </p>
              <p className="text-white/70 text-sm mt-2">
                Download links are valid for 24 hours. You can always access them from your order history.
              </p>
            </>
          )}
        </div>

        {/* Downloads */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          {data?.success && data.downloads && data.downloads.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-[#0A1A2F] font-serif text-center mb-6">
                Your Downloads
              </h2>
              {data.downloads.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-[#0A1A2F]">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Digital PDF — print at home or any print shop</p>
                  </div>
                  {item.downloadUrl ? (
                    <a
                      href={item.downloadUrl}
                      className="flex items-center gap-2 bg-[#C9A86A] hover:bg-[#c49b2a] text-[#0A1A2F] font-bold px-4 py-2 rounded-full text-sm transition-colors shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  ) : (
                    <div className="text-center shrink-0">
                      <p className="text-xs text-gray-500 max-w-[140px]">
                        Download preparing — refresh the page in a moment.
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Security notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                <RefreshCw className="w-3 h-3" />
                <span>Download links expire in 24 hours for security. Refresh this page to get new links.</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-[#0A1A2F]/5 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-[#0A1A2F] mb-3 text-center">How to Use Your Download</h3>
            <div className="space-y-2">
              {[
                "Click the Download PDF button above to save your file",
                "Open the PDF on any device — phone, tablet, or computer",
                "Print at home on standard 8.5×11\" paper, or take to Walgreens, CVS, FedEx, or any print shop",
                "Cards print beautifully on cardstock for a premium feel",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-[#C9A86A] text-[#0A1A2F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="text-center bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
            <Mail className="w-6 h-6 text-[#C9A86A] mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Need help? Email us at{" "}
              <a
                href="mailto:info@wisheswithoutbordersco.com"
                className="text-[#C9A86A] font-semibold hover:underline"
              >
                info@wisheswithoutbordersco.com
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-1">We respond within 24 hours</p>
          </div>

          {/* Newsletter signup */}
          {!emailSubmitted ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8 text-center">
              <h3 className="font-bold text-[#0A1A2F] mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-500 mb-3">Get notified about new cards, special offers, and free downloads.</p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A86A]"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-[#C9A86A] text-[#0A1A2F] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#c49b2a] transition-colors"
                >
                  {subscribeMutation.isPending ? "..." : "Subscribe"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 mb-8 text-center">
              <p className="text-green-700 font-semibold text-sm">You're on the list! We'll keep you updated.</p>
            </div>
          )}

          {/* Continue shopping */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0A1A2F] text-white font-bold px-6 py-3 rounded-full hover:bg-[#243560] transition-colors"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedData && relatedData.related.length > 0 && (
          <div className="bg-[#0A1A2F] py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold font-serif text-white text-center mb-2">
                You May Also Like
              </h2>
              <p className="text-white/60 text-sm text-center mb-8">
                Based on your purchase — more cards you might love
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedData.related.map((card) => (
                  <div
                    key={card.productId}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-white/10 flex flex-col"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-[#C9A86A] text-[#0A1A2F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {card.reason === "same_country" ? `More from ${card.country}` : "Same Occasion"}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-bold text-[#0A1A2F] text-sm leading-tight mb-1">{card.name}</p>
                      <p className="text-gray-400 text-xs mb-3 flex-1">
                        {card.cardType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C9A86A] font-bold">${(card.price / 100).toFixed(2)}</span>
                        <button
                          onClick={() => handleRelatedBuy(card.productId, card.name, card.price)}
                          disabled={buyingId === card.productId}
                          className="flex items-center gap-1.5 bg-[#0A1A2F] text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#243560] transition-colors disabled:opacity-50"
                        >
                          {buyingId === card.productId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-3 h-3" />
                          )}
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-[#0A1A2F] border-t border-white/10 text-white/50 text-center py-6 text-xs">
          <p className="italic text-[#C9A86A]/70 text-sm mb-3">Send a piece of home, back home.</p>
          All products are instant digital downloads · Print at home · wisheswithoutbordersco.com
        </footer>
      </div>
    </div>
  );
}
