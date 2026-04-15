import { Link } from "wouter";
import { NavBar } from "@/components/NavBar";

const CATEGORIES = [
  {
    href: "/birthday",
    emoji: "🎂",
    title: "Greeting Cards",
    desc: "2,444+ multicultural cards for every occasion — Birthday, Anniversary, Mother's Day, and more.",
    badge: "2,444+ Cards",
    color: "#c0392b",
  },
  {
    href: "/wall-art",
    emoji: "🖼️",
    title: "Wall Art",
    desc: "Beautiful cultural wall art prints celebrating 188 countries. Instant PDF download.",
    badge: "New",
    color: "#8e44ad",
  },
  {
    href: "/books/childrens",
    emoji: "📚",
    title: "Children's Books",
    desc: "\"A Day in the Life Of\" series — 45+ illustrated books celebrating cultures worldwide. Ages 4–8.",
    badge: "45+ Books",
    color: "#2980b9",
  },
  {
    href: "/education",
    emoji: "🎓",
    title: "Educational Resources",
    desc: "SEL kits, classroom resources, worksheets, flashcards, and activity workbooks for global learners.",
    badge: "For Teachers",
    color: "#27ae60",
  },
  {
    href: "/coloring-books",
    emoji: "🎨",
    title: "Coloring Books",
    desc: "Around the World coloring books with 100+ pages of cultural illustrations. Print at home.",
    badge: "New",
    color: "#e67e22",
  },
  {
    href: "/cookbooks",
    emoji: "🍽️",
    title: "Cookbooks",
    desc: "Culinary journeys through 195 countries. Recipes, cultural context, and food history.",
    badge: "New",
    color: "#e74c3c",
  },
  {
    href: "/activity-workbooks",
    emoji: "📓",
    title: "Activity Workbooks",
    desc: "Hands-on cultural learning activities for kids and families. 195+ countries covered.",
    badge: "195 Countries",
    color: "#16a085",
  },
  {
    href: "/flashcards",
    emoji: "🗂️",
    title: "Flashcards",
    desc: "466 cultural flashcards across 188 countries. Perfect for classrooms and home learning.",
    badge: "466 Cards",
    color: "#2c3e50",
  },
  {
    href: "/baby-shower",
    emoji: "🍼",
    title: "Baby Shower Games",
    desc: "Fun, printable multicultural baby shower games. Instant download, print at home.",
    badge: "Popular",
    color: "#f39c12",
  },
];

export default function DigitalProductsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />
      {/* Hero */}
      <section className="pt-24 pb-14 px-4 text-center" style={{ background: "#0A1A2F" }}>
        <span className="text-[#C9A86A] font-semibold text-sm uppercase tracking-widest">
          Instant PDF Downloads
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold mt-2 mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Digital Products
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-5" style={{ background: "#C9A86A" }} />
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Multicultural greeting cards, children's books, educational tools, and more — all instant
          PDF downloads celebrating 188+ countries and cultures.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/50">
          <span>⚡ Instant Download</span>
          <span>🖨️ Print at Home</span>
          <span>🌍 188+ Countries</span>
          <span>📦 2,444+ Products</span>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A86A]/50 transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-2 w-full"
                style={{ background: cat.color, opacity: 0.8 }}
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{cat.emoji}</span>
                  {cat.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "#C9A86A", color: "#0A1A2F" }}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>
                <h2
                  className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A86A] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.title}
                </h2>
                <p className="text-white/55 text-sm leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center text-[#C9A86A] text-sm font-semibold">
                  Browse {cat.title}
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 text-center" style={{ background: "#0A1A2F" }}>
        <h2
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Not sure where to start?
        </h2>
        <p className="text-white/60 mb-6 max-w-xl mx-auto">
          Browse our most popular products or search for a specific country or occasion.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/collections/best-sellers"
            className="px-6 py-3 rounded-full font-semibold text-sm transition-all"
            style={{ background: "#C9A86A", color: "#0A1A2F" }}
          >
            Best Sellers
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="px-6 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
          >
            New Arrivals
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
          >
            Search All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
