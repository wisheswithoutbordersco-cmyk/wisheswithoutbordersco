import { Link } from "wouter";

/**
 * Universal Product Detail Page Shell
 * Used for: Wall Art, Flashcards, Workbooks, Children's Books,
 *           Greeting Cards, SEL Kits, and all future product types.
 *
 * Product detail page — replace placeholder content with real product data via props or route params.
 */
export default function ProductDetailPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-sm" style={{ color: "rgba(10,26,47,0.5)" }}>
          <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/birthday" className="hover:text-[#C9A86A] transition-colors">Shop</Link>
          <span className="opacity-40">/</span>
          <span style={{ color: "#C9A86A" }}>Product Name</span>
        </nav>
      </div>

      {/* Product Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div
            className="rounded-2xl flex items-center justify-center aspect-square mb-4"
            style={{ background: "rgba(201,168,106,0.08)", border: "2px dashed rgba(201,168,106,0.3)" }}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">🖼️</div>
              <p className="text-sm" style={{ color: "rgba(10,26,47,0.4)" }}>Product Image</p>
            </div>
          </div>
          {/* Thumbnail row */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(201,168,106,0.08)", border: "1px dashed rgba(201,168,106,0.3)" }}
              >
                <span className="text-xs" style={{ color: "rgba(10,26,47,0.3)" }}>{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["Digital Download", "Instant PDF", "188 Countries"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(201,168,106,0.12)", color: "#C9A86A", border: "1px solid rgba(201,168,106,0.3)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
          >
            Product Title Placeholder
          </h1>
          <div className="w-12 h-0.5 mb-4" style={{ background: "#C9A86A" }} />

          {/* Description */}
          <p className="text-base mb-6 leading-relaxed" style={{ color: "rgba(10,26,47,0.7)" }}>
            Product description placeholder. This will contain a rich, culturally-informed description of the product, its contents, and what makes it special.
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-3xl font-bold"
              style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
            >
              $5.99
            </span>
            <span className="text-sm" style={{ color: "rgba(10,26,47,0.4)" }}>USD · Instant Download</span>
          </div>

          {/* Add to Cart */}
          <button
            className="w-full py-4 rounded text-sm font-bold uppercase tracking-wider mb-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
          >
            Add to Cart
          </button>
          <button
            className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wider border transition-all hover:-translate-y-0.5"
            style={{ background: "transparent", color: "#0A1A2F", borderColor: "rgba(10,26,47,0.2)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Buy Now
          </button>

          {/* Product Details */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(10,26,47,0.1)" }}>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider" style={{ color: "#0A1A2F" }}>
              What's Included
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(10,26,47,0.7)" }}>
              <li>✓ High-resolution PDF (300 DPI)</li>
              <li>✓ Instant digital download</li>
              <li>✓ Bilingual text (English + local language)</li>
              <li>✓ Wishes Without Borders watercolor artwork</li>
              <li>✓ Print at home or at any print shop</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div style={{ borderTop: "1px solid rgba(10,26,47,0.1)" }} className="pt-12">
          <h2
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
          >
            You May Also Like
          </h2>
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: "#C9A86A" }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}
              >
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ background: "rgba(201,168,106,0.06)" }}
                >
                  <span className="text-3xl">🌍</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0A1A2F" }}>Related Product {i}</p>
                  <p className="text-xs" style={{ color: "#C9A86A" }}>$5.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO placeholder */}

    </div>
  );
}
