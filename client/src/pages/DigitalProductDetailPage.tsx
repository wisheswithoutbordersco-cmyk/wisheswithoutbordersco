import { useRoute, Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { DIGITAL_PRODUCTS, type DigitalProduct } from "@/lib/productData";
import { ProductModal, type ProductInfo } from "@/components/ProductModal";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle, Zap, Download, Shield, Loader2, ChevronRight } from "lucide-react";

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  bestseller: { bg: "bg-amber-500", text: "text-white" },
  new: { bg: "bg-emerald-500", text: "text-white" },
  staffpick: { bg: "bg-purple-600", text: "text-white" },
  seasonal: { bg: "bg-rose-500", text: "text-white" },
};

export default function DigitalProductDetailPage() {
  const [, params] = useRoute("/:slug*");
  const slug = params?.slug ? `/${params.slug}` : "";

  const product = DIGITAL_PRODUCTS.find((p) => p.slug === slug);
  const [checkingOut, setCheckingOut] = useState(false);
  const { addItem, items } = useCart();
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  // SEO: set document title + meta
  useEffect(() => {
    if (product) {
      document.title = product.seoTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", product.metaDescription);
      else {
        const m = document.createElement("meta");
        m.name = "description";
        m.content = product.metaDescription;
        document.head.appendChild(m);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F5EF" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>Product Not Found</h1>
          <Link href="/" className="text-sm font-semibold" style={{ color: "#C9A86A" }}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  const alreadyInCart = items.some((i) => i.productId === product.id);
  const badgeStyle = BADGE_STYLES[product.badgeType] || BADGE_STYLES.new;

  // Related products: same category or random 4
  const related = DIGITAL_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const relatedFinal = related.length >= 2 ? related : DIGITAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    addItem({
      productId: product!.id,
      name: product!.title,
      image: product!.image,
      price: product!.price,
      category: product!.category,
    });
    toast.success(`${product!.title} added to cart!`);
  }

  async function handleBuyNow() {
    setCheckingOut(true);
    try {
      const origin = window.location.origin;
      const result = await checkoutMutation.mutateAsync({
        productId: product!.id,
        cartItems: [{
          productId: product!.id,
          name: product!.title,
          price: product!.price,
        }],
        successUrl: `${origin}/order-success`,
        cancelUrl: origin,
      });
      if (result.url) {
        toast.success("Redirecting to secure checkout...");
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
    <div className="min-h-screen" style={{ background: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar />

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "rgba(10,26,47,0.5)" }}>
          <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="hover:text-[#C9A86A] transition-colors">{product.categoryLabel}</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span style={{ color: "#C9A86A" }}>{product.title}</span>
        </nav>
      </div>

      {/* Product Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(10,26,47,0.15)", border: "1px solid rgba(201,168,106,0.18)" }}>
            <img src={product.image} alt={product.title} className="w-full aspect-[3/4] object-cover" />
            <span className={`absolute top-4 left-4 ${badgeStyle.bg} ${badgeStyle.text} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md`}>
              {product.badge}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["Digital Download", "Instant PDF", "Print at Home"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(201,168,106,0.12)", color: "#C9A86A", border: "1px solid rgba(201,168,106,0.3)" }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Category */}
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A86A" }}>
            {product.categoryLabel}
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
            {product.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base mb-4 italic" style={{ color: "rgba(10,26,47,0.55)" }}>
            {product.subtitle}
          </p>

          <div className="w-12 h-0.5 mb-4" style={{ background: "#C9A86A" }} />

          {/* Description */}
          <p className="text-base mb-6 leading-relaxed" style={{ color: "rgba(10,26,47,0.7)" }}>
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
              ${(product.price / 100).toFixed(2)}
            </span>
            <span className="text-sm" style={{ color: "rgba(10,26,47,0.4)" }}>USD · Instant Download</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleBuyNow}
              disabled={checkingOut || checkoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full disabled:opacity-60 text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#C9A86A", color: "#0A1A2F" }}
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
              className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-full disabled:opacity-50 text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5"
              style={{ border: "2px solid #0A1A2F", color: "#0A1A2F", background: "transparent" }}
            >
              {alreadyInCart ? (
                <><CheckCircle className="w-4 h-4" /> Already in Cart</>
              ) : (
                <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-2 mb-6">
            {[
              { Icon: Zap, text: "Instant PDF download — available immediately after purchase" },
              { Icon: Download, text: "Print at home or at any print shop (Walgreens, CVS, FedEx)" },
              { Icon: Shield, text: "Secure checkout via Stripe — no account required" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "rgba(10,26,47,0.55)" }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color: "#C9A86A" }} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="pt-6" style={{ borderTop: "1px solid rgba(10,26,47,0.1)" }}>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: "#0A1A2F" }}>
              What's Included
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(10,26,47,0.7)" }}>
              {product.whatsIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C9A86A] mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedFinal.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div style={{ borderTop: "1px solid rgba(10,26,47,0.1)" }} className="pt-12">
            <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
              You May Also Like
            </h2>
            <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: "#C9A86A" }} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedFinal.map((rp) => (
                <Link
                  key={rp.id}
                  href={rp.slug}
                  className="group rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}
                >
                  <div className="relative aspect-square overflow-hidden" style={{ background: "rgba(201,168,106,0.06)" }}>
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <span className={`absolute top-2 left-2 ${(BADGE_STYLES[rp.badgeType] || BADGE_STYLES.new).bg} ${(BADGE_STYLES[rp.badgeType] || BADGE_STYLES.new).text} text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                      {rp.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold mb-1 leading-tight" style={{ color: "#0A1A2F" }}>{rp.title}</p>
                    <p className="text-xs font-bold" style={{ color: "#C9A86A" }}>${(rp.price / 100).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust Bar */}
      <div className="py-8 px-4" style={{ background: "#0A1A2F" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🔒", title: "Secure Checkout", desc: "SSL encrypted payments" },
            { icon: "⚡", title: "Instant PDF Delivery", desc: "Download immediately" },
            { icon: "🖨️", title: "Print at Home", desc: "Any printer, any size" },
            { icon: "💳", title: "One-Time Purchase", desc: "No subscription required" },
          ].map((item) => (
            <div key={item.title}>
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <p className="text-xs font-bold mb-0.5" style={{ color: "#C9A86A" }}>{item.title}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ background: "#0A1A2F" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          &copy; {new Date().getFullYear()} Wishes Without Borders Co. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
