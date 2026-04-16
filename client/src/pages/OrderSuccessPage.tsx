import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { CheckCircle, Download, ArrowRight, Loader2, Mail, Home, ShoppingCart, Printer, Package, Truck } from "lucide-react";

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
  const orderTypeParam = searchParams.get("type") ?? "";

  // Pick the first purchased product for related suggestions
  const firstProductId = productsParam.split(",")[0] ?? "";

  const { data: relatedData } = trpc.shop.getRelatedProducts.useQuery(
    { productId: firstProductId },
    { enabled: !!firstProductId && orderTypeParam !== "print" }
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

  const isPhysicalPrint = data?.orderType === "physical_print" || orderTypeParam === "print";

  if (!sessionId) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500">No order found.</p>
            <Link href="/" className="mt-4 inline-block text-[#d4af37] hover:underline">
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
      <div className="min-h-screen bg-[#faf8f4]">
        {/* Hero */}
        <div className="bg-[#1a2744] text-white py-16 px-4 text-center">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#d4af37]" />
              <h1 className="text-2xl font-bold font-serif">Confirming your order...</h1>
              <p className="text-white/70 mt-2">Please wait while we verify your payment.</p>
            </>
          ) : error || !data?.success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold font-serif">Payment Received!</h1>
              <p className="text-white/70 mt-2 max-w-md mx-auto">
                Your payment was processed.{" "}
                {isPhysicalPrint
                  ? "Your print order is being set up. "
                  : "If your download links don't appear below, "}
                please email us at{" "}
                <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#d4af37] hover:underline">
                  info@wisheswithoutbordersco.com
                </a>{" "}
                {isPhysicalPrint ? "if you have any questions." : "and we'll send your files right away."}
              </p>
            </>
          ) : isPhysicalPrint ? (
            /* ── Physical Print Success Hero ── */
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold font-serif mb-2">
                Your Print Order Is Confirmed!
              </h1>
              <p className="text-[#d4af37] text-lg font-semibold">
                {data.productName ?? "Physical Wall Art Print"}
              </p>
              <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">
                Your poster is being prepared for printing. You'll receive a shipping confirmation email once it ships.
              </p>
            </>
          ) : (
            /* ── Digital Download Success Hero ── */
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold font-serif mb-2">
                Thank You for Your Order!
              </h1>
              <p className="text-[#d4af37] text-lg font-semibold">
                Your digital downloads are ready below
              </p>
              <p className="text-white/70 text-sm mt-2">
                A confirmation email has been sent to your inbox.
              </p>
            </>
          )}
        </div>

        {/* Content area */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* ── Physical Print: Order Details ── */}
          {data?.success && isPhysicalPrint && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-[#1a2744] font-serif text-center mb-6">
                What Happens Next
              </h2>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      icon: <Printer className="w-5 h-5 text-[#d4af37]" />,
                      title: "Printing",
                      desc: "Your poster is being printed at the Gelato facility nearest to your shipping address.",
                    },
                    {
                      icon: <Truck className="w-5 h-5 text-[#d4af37]" />,
                      title: "Shipping",
                      desc: "Once printed, your order ships with tracking. Expect delivery in 5\u201310 business days.",
                    },
                    {
                      icon: <Mail className="w-5 h-5 text-[#d4af37]" />,
                      title: "Email Updates",
                      desc: "You'll receive email updates with tracking information as your order progresses.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#faf8f4] flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a2744] text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browse more prints CTA */}
              <div className="text-center pt-4">
                <Link
                  href="/print-shop"
                  className="inline-flex items-center gap-2 bg-[#1a2744] text-white font-bold px-6 py-3 rounded-full hover:bg-[#243560] transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Browse More Prints
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* ── Digital Downloads ── */}
          {data?.success && !isPhysicalPrint && data.downloads && data.downloads.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-[#1a2744] font-serif text-center mb-6">
                Your Downloads
              </h2>
              {data.downloads.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-[#1a2744]">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Digital PDF — print at home or any print shop</p>
                  </div>
                  {item.downloadUrl ? (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#c49b2a] text-[#1a2744] font-bold px-4 py-2 rounded-full text-sm transition-colors shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  ) : (
                    <div className="text-center shrink-0">
                      <p className="text-xs text-gray-500 max-w-[140px]">
                        Download link coming soon — check your email or contact us.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Instructions — only for digital orders */}
          {!isPhysicalPrint && (
            <div className="bg-[#1a2744]/5 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-[#1a2744] mb-3 text-center">How to Use Your Download</h3>
              <div className="space-y-2">
                {[
                  "Click the Download PDF button above to save your file",
                  "Open the PDF on any device — phone, tablet, or computer",
                  "Print at home on standard 8.5\u00d711\" paper, or take to Walgreens, CVS, FedEx, or any print shop",
                  "Cards print beautifully on cardstock for a premium feel",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#1a2744] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support */}
          <div className="text-center bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
            <Mail className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Need help? Email us at{" "}
              <a
                href="mailto:info@wisheswithoutbordersco.com"
                className="text-[#d4af37] font-semibold hover:underline"
              >
                info@wisheswithoutbordersco.com
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-1">We respond within 24 hours</p>
          </div>

          {/* Continue shopping */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#1a2744] text-white font-bold px-6 py-3 rounded-full hover:bg-[#243560] transition-colors"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* You May Also Like — only for digital orders */}
        {!isPhysicalPrint && relatedData && relatedData.related.length > 0 && (
          <div className="bg-[#1a2744] py-12 px-4">
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
                    {/* Card image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/400x300/1a2744/d4af37?text=${encodeURIComponent(card.country)}`;
                        }}
                      />
                      {/* Reason badge */}
                      <span className="absolute top-2 left-2 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {card.reason === "same_country" ? `More from ${card.country}` : "Same Occasion"}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-bold text-[#1a2744] text-sm leading-tight mb-1">{card.name}</p>
                      <p className="text-gray-400 text-xs mb-3 flex-1">
                        {card.cardType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#d4af37] font-bold">${(card.price / 100).toFixed(2)}</span>
                        <button
                          onClick={() => handleRelatedBuy(card.productId, card.name, card.price)}
                          disabled={buyingId === card.productId}
                          className="flex items-center gap-1.5 bg-[#1a2744] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#243560] transition-colors disabled:opacity-50"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          {buyingId === card.productId ? "..." : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Email capture */}
        <div className="bg-[#f5f0e8] py-12 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold font-serif text-[#1a2744] mb-2">
              New Countries Added Every Month
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              We're always expanding. Get notified when we add new countries, card types, and products.
            </p>
            {emailSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-[#1a2744] font-semibold">
                <CheckCircle className="w-5 h-5 text-green-600" />
                You're on the list — we'll be in touch!
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 border border-[#d4af37] rounded-full px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 bg-white"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-[#d4af37] text-[#1a2744] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#c9a227] transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {subscribeMutation.isPending ? "..." : "Notify Me"}
                </button>
              </form>
            )}
            <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
