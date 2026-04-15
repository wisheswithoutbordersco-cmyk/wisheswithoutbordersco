import { X, ShoppingBag, Trash2, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, removeItem, clearCart, total, isOpen, closeCart } = useCart();
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  async function handleCheckout() {
    if (items.length === 0) return;
    // For multi-item checkout, we process each item individually via Stripe
    // For simplicity, checkout the first item; in production use a bundle product
    // Here we create a checkout for each item and open the first one
    try {
      const origin = window.location.origin;
      // Create checkout for all items — we'll use the first item's productId
      // and pass all items as metadata
      const firstItem = items[0];
      const result = await checkoutMutation.mutateAsync({
        productId: firstItem.productId,
        cartItems: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price })),
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}/cart`,
      });
      if (result.url) {
        toast.success("Redirecting to secure checkout...");
        window.location.href = result.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeCart}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#0A1A2F] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-bold text-lg">Your Cart ({items.length})</h2>
          </div>
          <button onClick={closeCart} className="hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Browse our cards and add them here</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A1A2F] leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  {item.country && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.country}</p>
                  )}
                  <p className="text-[#C9A86A] font-bold mt-1">
                    ${(item.price / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0 self-start mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-4 py-4 space-y-3 bg-white">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
              <span className="font-bold text-[#0A1A2F] text-base">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Instant PDF download after payment
            </p>
            <button
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A86A] hover:bg-[#c49b2a] text-[#0A1A2F] font-bold py-3 rounded-full transition-colors disabled:opacity-60"
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {checkoutMutation.isPending ? "Processing..." : "Checkout Securely"}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
