import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { GRADUATION_CARDS } from "@/lib/productData";
import { ShoppingCart, Gamepad2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const GAMES_30 = [
  "Bingo", "How Well Do You Know", "Future Predictions", "Word Scramble",
  "Trivia", "Two Truths & a Lie", "Price Is Right", "Mad Libs",
  "Advice for Grad", "Bucket List", "Guess the Major", "Emoji Pictionary",
  "Cap & Gown Scavenger Hunt", "This or That", "Wishes for Grad",
  "Never Have I Ever", "Word Search", "Karaoke Roulette", "Roast Cards",
  "Time Capsule", "Charades", "Decades Trivia", "Gift Bingo",
  "Would You Rather", "Memory Lane", "Name That Tune", "Superlatives",
  "Gratitude Cards", "Photo Challenge", "Advice Book"
];

const BUNDLES = [
  {
    id: "grad-games-30",
    title: "30 Graduation Party Games Bundle",
    price: "$12.99",
    pdfLink: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/pfZhsXpXeFXsihJx.pdf",
    desc: "The ultimate party pack — less than 50¢ per game! All 30 games included. Perfect for high school & college graduation parties.",
    badge: "Best Value",
    mockup: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/mockup_01_spread_850f2127.jpg",
    mockup2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/mockup_02_party_d3de8ef8.jpg",
    games: GAMES_30,
  },
  {
    id: "grad-games-10",
    title: "10 Graduation Party Games Bundle",
    price: "$5.99",
    pdfLink: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/KqqsVyaRpkmlMTQe.pdf",
    desc: "Perfect starter pack — the 10 most popular graduation party games. Great for smaller gatherings.",
    badge: "Starter Pack",
    mockup: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/mockup_01_table_b974d1b3.jpg",
    mockup2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/mockup_02_party_456f3faf.jpg",
    games: GAMES_30.slice(0, 10),
  },
];

const BUNDLE_PRICES: Record<string, number> = {
  "grad-games-30": 1299,
  "grad-games-10": 699,
};

export default function GraduationPage() {
  const [activeBundle, setActiveBundle] = useState("grad-games-30");
  const [checkingOut, setCheckingOut] = useState(false);
  const bundle = BUNDLES.find((b) => b.id === activeBundle)!;
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  async function handleBundleBuy() {
    setCheckingOut(true);
    try {
      const origin = window.location.origin;
      const priceInCents = BUNDLE_PRICES[bundle.id] ?? 1299;
      const result = await checkoutMutation.mutateAsync({
        productId: bundle.id,
        cartItems: [{ productId: bundle.id, name: bundle.title, price: priceInCents }],
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}/graduation`,
      });
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Redirecting to secure checkout...");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div>
      <NavBar />

      {/* Whisper line */}
      <p className="text-center italic text-[#C9A86A]/70 text-sm py-3 bg-[#F8F5EF]">They believed in you from across the ocean.</p>

      {/* Cards Section */}
      {GRADUATION_CARDS.length > 0 ? (
        <CardGallery
          cards={GRADUATION_CARDS}
          title="Graduation Cards"
          subtitle="Celebrate graduates from around the world — in their language, with their culture"
          priceInCents={599}
          category="graduation"
        />
      ) : (
        <div className="bg-[#F8F5EF] py-16 px-4 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold font-serif text-[#0A1A2F] mb-3">Graduation Cards</h2>
            <p className="text-[#0A1A2F]/60 mb-4">Celebrate graduates from around the world — in their language, with their culture</p>
            <span className="inline-block bg-[#C9A86A]/20 text-[#0A1A2F] text-sm font-semibold px-4 py-2 rounded-full">Coming Soon</span>
          </div>
        </div>
      )}

      {/* ── Graduation Party Games ─────────────────────────────────── */}
      <div className="bg-[#0A1A2F] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gamepad2 className="w-7 h-7 text-[#C9A86A]" />
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-white">
                Graduation Party Games
              </h2>
            </div>
            <p className="text-white/70 text-sm max-w-xl mx-auto">
              Printable party games for high school & college graduation parties. Print at home or at any print shop. Instant PDF download.
            </p>
            {/* Bundle Toggle */}
            <div className="flex justify-center gap-3 mt-5 flex-wrap">
              {BUNDLES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBundle(b.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeBundle === b.id
                      ? "bg-[#C9A86A] text-[#0A1A2F]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {b.games.length} Games — {b.price}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Mockup Images */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={bundle.mockup}
                  alt={`${bundle.title} mockup`}
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={bundle.mockup2}
                  alt={`${bundle.title} party mockup`}
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%230A1A2F'%3E%3Crect width='300' height='400'/%3E%3Ctext x='150' y='180' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EWishes Without%3C/text%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23C9A86A' font-size='14' font-family='sans-serif'%3EBorders Co%3C/text%3E%3Ctext x='150' y='240' text-anchor='middle' fill='%23C9A86A' font-size='28'%3E%F0%9F%8C%8D%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

            {/* Bundle Details */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#C9A86A] text-[#0A1A2F] text-xs font-bold rounded-full">
                  {bundle.badge}
                </span>
                <span className="text-2xl font-bold text-[#C9A86A]">{bundle.price}</span>
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">{bundle.title}</h3>
              <p className="text-white/70 text-sm mb-5">{bundle.desc}</p>

              {/* Game List */}
              <div className="bg-white/10 rounded-xl p-4 mb-5">
                <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-wider mb-3">
                  {bundle.games.length} Games Included:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {bundle.games.map((game, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-white/80 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0" />
                      {game}
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white/5 rounded-xl p-4 mb-5 text-sm text-white/70 space-y-1">
                <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2">How It Works</p>
                <p>1. Purchase → instant download in seconds</p>
                <p>2. Print at home or at Walgreens, CVS, or Staples</p>
                <p>3. Print as many copies as you need!</p>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-[#C9A86A] text-[#0A1A2F] font-bold rounded-full hover:bg-[#c9a227] transition-colors text-sm disabled:opacity-60"
                onClick={handleBundleBuy}
                disabled={checkingOut || checkoutMutation.isPending}
              >
                {checkingOut || checkoutMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {checkingOut || checkoutMutation.isPending ? "Processing..." : `Buy Now — ${bundle.price}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1A2F] border-t border-white/10 text-white/50 text-center py-6 text-xs">
        <p className="italic text-[#C9A86A]/70 text-sm mb-3">Send a piece of home, back home.</p>
        All products are instant digital downloads · Print at home · wisheswithoutbordersco.com
      </footer>
    </div>
  );
}
