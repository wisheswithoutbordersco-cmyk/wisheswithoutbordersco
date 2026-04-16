import { X, ShoppingCart, Download, Star, Shield, Zap, Loader2, CheckCircle, Printer } from "lucide-react";
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
  /** Optional callback — when provided, an "Order Physical Print" button appears */
  onOrderPrint?: () => void;
};

export function ProductModal({ product, onClose, onOrderPrint }: Props) {
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
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-[#1a2744] text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-semibold text-[#d4af37]">
                {product.category ? product.category.replace(/_/g, " ").toUpperCase() : "DIGITAL PRODUCT"}
              </span>
            </div>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row gap-6 p-6">
            {/* Image */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-48 sm:w-56 rounded-xl overflow-hidden shadow-lg border border-gray-100" style={{ aspectRatio: "3/4" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/300x400/f5f0e8/1a2744?text=Card";
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                {product.country && (
                  <p className="text-sm text-[#d4af37] font-semibold uppercase tracking-wide mb-1">
                    {product.country}
                  </p>
                )}
                <h2 className="text-xl font-bold text-[#1a2744] leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">Digital Download</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#1a2744]">
                  ${(product.price / 100).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${((product.price / 100) * 1.5).toFixed(2)}
                </span>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                  33% OFF
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Zap className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Instant PDF download — available immediately after purchase</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Download className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Print at home or at any print shop (Walgreens, CVS, FedEx)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>Secure checkout via Stripe — no account required</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <button
                  onClick={handleBuyNow}
                  disabled={checkingOut || checkoutMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c49b2a] text-[#1a2744] font-bold py-3 rounded-full transition-colors disabled:opacity-60 text-sm"
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
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#1a2744] text-[#1a2744] font-bold py-2.5 rounded-full hover:bg-[#1a2744] hover:text-white transition-colors disabled:opacity-50 text-sm"
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

                {/* Order Physical Print — only for wall art */}
                {onOrderPrint && (
                  <button
                    onClick={onOrderPrint}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a2744] text-white font-bold py-2.5 rounded-full hover:bg-[#243560] transition-colors text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Order Physical Print — from $9.99
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <div className="bg-[#faf8f4] rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">
                <strong className="text-[#1a2744]">Wishes Without Borders</strong> — Multicultural greeting cards celebrating 30+ countries.
                Questions? Email <a href="mailto:info@wisheswithoutbordersco.com" className="text-[#d4af37] hover:underline">info@wisheswithoutbordersco.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
