import { X, ShoppingCart, Download, Shield, Zap, Loader2, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export type ProductInfo = {
  productId: string;
  name: string;
  image: string;
  price: number; // in cents
  country?: string;
  category?: string;
  description?: string;
};

type Props = {
  product: ProductInfo | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  const { addItem, items } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  if (!product) return null;

  const alreadyInCart = items.some((i) => i.productId === product.productId);

  function handleAddToCart() {
    addItem({
      productId: product!.productId,
      name: product!.name,
      image: product!.image,
      price: product!.price,
      country: product!.country,
      category: product!.category,
    });
    toast.success(`${product!.name} added to cart!`);
  }

  async function handleBuyNow() {
    setCheckingOut(true);
    try {
      const origin = window.location.origin;
      const result = await checkoutMutation.mutateAsync({
        productId: product!.productId,
        cartItems: [{
          productId: product!.productId,
          name: product!.name,
          price: product!.price,
        }],
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}`,
      });
      if (result.url) {
        toast.success("Redirecting to secure checkout...");
        onClose();
        window.location.href = result.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          style={{ animation: "slideUp 0.3s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b rounded-t-2xl" style={{ background: "#0A1A2F" }}>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" style={{ color: "#C9A86A" }} />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}>
                {product.category ? product.category.replace(/_/g, " ") : "Digital Product"}
              </span>
            </div>
            <button onClick={onClose} className="transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.7)" }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row gap-6 p-6">
            {/* Image */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-48 sm:w-56 rounded-xl overflow-hidden" style={{ aspectRatio: "3/4", boxShadow: "0 8px 32px rgba(10,26,47,0.14)", border: "1px solid rgba(201,168,106,0.18)" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                      img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                {product.country && (
                  <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}>
                    {product.country}
                  </p>
                )}
                <h2 className="text-xl font-bold leading-tight" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
                  {product.name}
                </h2>
                <div className="mt-2 mb-1" style={{ height: "1px", width: "48px", background: "linear-gradient(90deg, #C9A86A, transparent)" }} />
                <p className="text-xs" style={{ color: "rgba(10,26,47,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Instant Digital Download</p>
              </div>

              {/* Price — real price only, no fake discount */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
                  ${(product.price / 100).toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: "rgba(10,26,47,0.4)", fontFamily: "'DM Sans', sans-serif" }}>USD</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,26,47,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  {product.description}
                </p>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 gap-2">
                {[
                  { Icon: Zap,      text: "Instant PDF download — available immediately after purchase" },
                  { Icon: Download, text: "Print at home or at any print shop (Walgreens, CVS, FedEx)" },
                  { Icon: Shield,   text: "Secure checkout via Stripe — no account required" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs" style={{ color: "rgba(10,26,47,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#C9A86A" }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <button
                  onClick={handleBuyNow}
                  disabled={checkingOut || checkoutMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-full disabled:opacity-60 text-sm"
                  style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 20px rgba(201,168,106,0.3)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
                >
                  {checkingOut || checkoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {checkingOut || checkoutMutation.isPending ? "Processing..." : "Buy Now — Instant Download"}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={alreadyInCart}
                  className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-full disabled:opacity-50 text-sm"
                  style={{ border: "2px solid #0A1A2F", color: "#0A1A2F", background: "transparent", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.2s ease, background 0.2s ease, color 0.2s ease" }}
                  onMouseEnter={(e) => { if (!alreadyInCart) { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(-2px)"; el.style.background = "#0A1A2F"; el.style.color = "#fff"; } }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(0)"; el.style.background = "transparent"; el.style.color = "#0A1A2F"; }}
                >
                  {alreadyInCart ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Already in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <div className="rounded-xl p-3 text-center" style={{ background: "#F8F5EF" }}>
              <p className="text-xs" style={{ color: "rgba(10,26,47,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                <strong style={{ color: "#0A1A2F" }}>Wishes Without Borders Co</strong> — Multicultural greeting cards celebrating the world's cultures.{" "}
                Questions? Email{" "}
                <a href="mailto:info@wisheswithoutbordersco.com" className="hover:underline" style={{ color: "#C9A86A" }}>info@wisheswithoutbordersco.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
