import { useState, useMemo } from "react";
import { NavBar } from "@/components/NavBar";
import { CardGallery } from "@/components/CardGallery";
import { LoadingGallery } from "@/components/LoadingGallery";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Gamepad2, Loader2 } from "lucide-react";
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

// Graduation cards come from 3 source_constants merged together
const GRAD_SOURCES = ["GRADUATION_BOY_CARDS", "GRADUATION_GIRL_CARDS", "GRADUATION_CONGRATS_CARDS"];

export default function GraduationPage() {
  const [activeBundle, setActiveBundle] = useState("grad-games-30");
  const [checkingOut, setCheckingOut] = useState(false);
  const bundle = BUNDLES.find((b) => b.id === activeBundle)!;
  const checkoutMutation = trpc.shop.createCheckout.useMutation();

  // Fetch graduation cards from DB
  const { data, isLoading, error } = trpc.shop.getProductsBySources.useQuery({
    sourceConstants: GRAD_SOURCES,
  });

  const cards = useMemo(() => {
    if (!data) return [];
    return data.map((row) => ({
      id: row.id,
      country: row.country ?? "",
      image: row.coverImageUrl ?? "",
    }));
  }, [data]);

  const isEmpty = !isLoading && !error && cards.length === 0;

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
    <div className="bg-[#0a0a0a] text-white">
      <NavBar />

      {/* Graduation Cards Section */}
      {(isLoading || error || isEmpty) ? (
        <LoadingGallery isLoading={isLoading} error={error} isEmpty={isEmpty} itemLabel="graduation cards" />
      ) : (
        <CardGallery
          cards={cards}
          title="Graduation Cards"
          subtitle="Celebrate graduates from around the world — in their language, with their culture. Culturally authentic designs for a monumental milestone."
          priceInCents={599}
          category="graduation"
        />
      )}

      {/* ── Graduation Party Games ─────────────────────────────────── */}
      <section className="bg-[#0a0a0a] border-t border-white/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-[#C9A86A]" />
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
                Graduation Party Games
              </h2>
            </div>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Printable party games for high school & college graduation parties. Print at home or at any print shop. Instant PDF download.
            </p>
            {/* Bundle Toggle */}
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              {BUNDLES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBundle(b.id)}
                  className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${
                    activeBundle === b.id
                      ? "bg-[#C9A86A] text-black border-[#C9A86A]"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-[#C9A86A] hover:text-[#C9A86A]"
                  }`}
                >
                  {b.games.length} Games — {b.price}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Mockup Images */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={bundle.mockup}
                  alt={`${bundle.title} mockup`}
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400/1a1a1a/C9A86A?text=Party+Games";
                  }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={bundle.mockup2}
                  alt={`${bundle.title} party mockup`}
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400/1a1a1a/C9A86A?text=Party+Games";
                  }}
                />
              </div>
            </div>

            {/* Bundle Details */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#C9A86A] text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {bundle.badge}
                </span>
                <span className="text-3xl font-bold text-[#C9A86A]">{bundle.price}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif mb-4">{bundle.title}</h3>
              <p className="text-white/60 text-base mb-8">{bundle.desc}</p>

              {/* Game List */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-4">
                  {bundle.games.length} Games Included:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {bundle.games.map((game, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/80 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0" />
                      {game}
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-sm text-white/70 space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-widest mb-3">How It Works</p>
                <div className="flex gap-3">
                  <span className="text-[#C9A86A] font-bold">01</span>
                  <p>Purchase → instant download in seconds</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C9A86A] font-bold">02</span>
                  <p>Print at home or at any print shop</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C9A86A] font-bold">03</span>
                  <p>Print as many copies as you need!</p>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A86A] text-black font-bold rounded-xl hover:bg-[#b8975a] transition-all text-sm uppercase tracking-widest disabled:opacity-60"
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
      </section>
    </div>
  );
}
