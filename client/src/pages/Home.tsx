import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
const BRAND = { logo: "", name: "Wishes Without Borders Co" };
import {
  Globe,
  BookOpen,
  Baby,
  Heart,
  GraduationCap,
  Star,
  Flower2,
  Sun,
  Smile,
  Ribbon,
  Search,
  Sparkles,
  Printer,
  ArrowRight,
  Gift,
  Palette,
  BookOpenCheck,
  CookingPot,
  Image as ImageIcon,
  Clock,
  Users,
  School,
  Calendar,
  CheckCircle,
  ShieldCheck,
  Download,
  MapPin,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/* ─── Sliding Category Tiles data ──────────────────────────────────────── */
const CATEGORY_TILES = [
  {
    href: "/birthday",
    title: "Digital Cards",
    desc: "Beautifully illustrated, culturally specific cards for birthdays, holidays, and everyday moments.",
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/mghkqMfrjYlxqeck.png",
  },
  {
    href: "/print-shop",
    title: "Wall Art",
    desc: "Stunning cultural prints designed to brighten your home, classroom, or office.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BH_birthday_mom_wall_art_8x10_427a59ed.jpg",
  },
  {
    href: "/coloring-books",
    title: "Books",
    desc: "Children's books and coloring adventures that celebrate global cultures and traditions.",
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/WrIfhPVqyZhBjgwM.png",
  },
  {
    href: "/activity-workbooks",
    title: "Classroom Systems",
    desc: "Activity workbooks, flashcards, and educator tools crafted for K\u201312 multicultural learning.",
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/kqMVLloxNPshLEcX.png",
  },
];

/* ─── Country Holiday Calendar data ────────────────────────────────────── */
const HOLIDAYS = [
  { date: "May 5", name: "Cinco de Mayo", countries: "Mexico", link: "/birthday?country=Mexico", color: "bg-green-500" },
  { date: "May 11", name: "Mother\u2019s Day", countries: "US, Canada, Australia & more", link: "/mothers-day", color: "bg-pink-500" },
  { date: "May 25", name: "Africa Day", countries: "African Union nations", link: "/birthday?country=Nigeria", color: "bg-emerald-600" },
  { date: "June 1", name: "Children\u2019s Day", countries: "Many countries worldwide", link: "/birthday", color: "bg-sky-500" },
  { date: "June 15", name: "Father\u2019s Day", countries: "US, UK, Canada", link: "/fathers-day", color: "bg-indigo-600" },
  { date: "June 19", name: "Juneteenth", countries: "United States", link: "/birthday?country=USA", color: "bg-red-600" },
  { date: "July 4", name: "Independence Day", countries: "United States", link: "/birthday?country=USA", color: "bg-blue-700" },
  { date: "Aug 1", name: "Emancipation Day", countries: "Jamaica, Trinidad & Tobago", link: "/birthday?country=Jamaica", color: "bg-amber-600" },
  { date: "Aug 15", name: "Independence Day", countries: "India", link: "/birthday?country=India", color: "bg-orange-500" },
  { date: "Sep 15", name: "Independence Day", countries: "Mexico, Guatemala, Honduras & more", link: "/birthday?country=Mexico", color: "bg-green-600" },
  { date: "Oct 1", name: "Independence Day", countries: "Nigeria", link: "/birthday?country=Nigeria", color: "bg-emerald-500" },
  { date: "Nov 1", name: "D\u00eda de los Muertos", countries: "Mexico", link: "/birthday?country=Mexico", color: "bg-purple-600" },
  { date: "Dec 26", name: "Kwanzaa Begins", countries: "African diaspora worldwide", link: "/birthday", color: "bg-red-700" },
];

/* ─── Country list for search ──────────────────────────────────────────── */
const ALL_COUNTRIES = ["Afghanistan","Albania","Algeria","Angola","Antigua","Argentina","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Cambodia","Cameroon","Canada","Cape Verde","Chad","Chile","China","Colombia","Comoros","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Curacao","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary","India","Indonesia","Iran","Iraq","Ireland","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali","Marshall Islands","Martinique","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda","Saint Kitts","Saint Lucia","Saint Vincent","Samoa","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor Leste","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","UAE","USA","Uganda","Ukraine","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Western Sahara","Yemen","Zambia","Zimbabwe"];

/* ─── Subtle fade-in animation variants ────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

/* ─── Countdown helper ─────────────────────────────────────────────────── */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export default function Home() {
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const footerSubscribe = trpc.shop.subscribeNewsletter.useMutation();

  /* Country search state */
  const [countryQuery, setCountryQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("birthday");
  const searchRef = useRef<HTMLDivElement>(null);

  const SEARCH_CATEGORIES = [
    { key: "birthday",        label: "Birthday" },
    { key: "anniversary",     label: "Anniversary" },
    { key: "graduation",      label: "Graduation" },
    { key: "congratulations", label: "Congrats" },
    { key: "thank-you",       label: "Thank You" },
    { key: "sympathy",        label: "Sympathy" },
    { key: "get-well",        label: "Get Well" },
    { key: "mothers-day",     label: "Mother\u2019s Day" },
    { key: "fathers-day",     label: "Father\u2019s Day" },
  ];

  const countrySuggestions = countryQuery.trim().length > 0
    ? ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCountrySelect(country: string) {
    setCountryQuery("");
    setShowSuggestions(false);
    window.location.href = `/${selectedCategory}?country=${encodeURIComponent(country)}`;
  }

  function handleCountrySearch(e: React.FormEvent) {
    e.preventDefault();
    if (countrySuggestions.length > 0) {
      handleCountrySelect(countrySuggestions[0]);
    } else if (countryQuery.trim()) {
      window.location.href = `/${selectedCategory}?country=${encodeURIComponent(countryQuery.trim())}`;
    }
  }

  async function handleFooterSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    try {
      const result = await footerSubscribe.mutateAsync({ email: footerEmail.trim(), source: "homepage_footer" });
      setFooterSubmitted(true);
      toast.success(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  /* Mother's Day 2026 countdown — May 10, 2026 (second Sunday of May) */
  const mothersDayTarget = new Date("2026-05-10T23:59:59");
  const countdown = useCountdown(mothersDayTarget);
  const mothersDayPassed = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* ══════════════════════════════════════════════════════════════════════
          1. MOTHER'S DAY COUNTDOWN BANNER
          ══════════════════════════════════════════════════════════════════════ */}
      {!mothersDayPassed && (
        <section className="bg-gradient-to-r from-[#1a2744] via-[#2a3a5c] to-[#1a2744] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-pink-400/10 to-rose-500/10" />
          <div className="relative max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <Flower2 className="w-5 h-5 text-pink-300 shrink-0" />
              <span className="text-white font-semibold text-sm">
                Mother&rsquo;s Day is May 10!
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm font-mono">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2.5 py-1">
                <Clock className="w-3.5 h-3.5 text-pink-300" />
                <span className="font-bold tabular-nums">{countdown.days}</span>
                <span className="text-white/50 text-xs">d</span>
              </div>
              <span className="text-white/30">:</span>
              <div className="bg-white/10 rounded-lg px-2.5 py-1">
                <span className="font-bold tabular-nums">{countdown.hours}</span>
                <span className="text-white/50 text-xs ml-1">h</span>
              </div>
              <span className="text-white/30">:</span>
              <div className="bg-white/10 rounded-lg px-2.5 py-1">
                <span className="font-bold tabular-nums">{countdown.minutes}</span>
                <span className="text-white/50 text-xs ml-1">m</span>
              </div>
            </div>
            <Link
              href="/mothers-day"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs px-5 py-2 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg shadow-pink-500/25"
            >
              Shop Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Warm light cream/sand gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f4] via-[#f5f0e8] to-[#fdf6ed]" />
        {/* Decorative soft warm circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left — copy */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-4">
                <span className="text-[#d4af37] font-semibold text-xs uppercase tracking-widest">Wishes Without Borders Co</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[#1a2744] leading-tight mb-5">
                Helping Kids See the World{" "}
                <span className="bg-gradient-to-r from-[#d4af37] via-amber-500 to-[#c9a227] bg-clip-text text-transparent">
                  &mdash; and Feel Like They Belong in It
                </span>
              </h1>
              <p className="text-[#4a5568] text-lg md:text-xl max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
                Culturally authentic greeting cards, children&rsquo;s books, and educational resources that bring global traditions into your home and classroom.
              </p>

              {/* Country Search Bar */}
              <div ref={searchRef} className="relative mb-8 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {SEARCH_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                        selectedCategory === cat.key
                          ? "bg-[#d4af37] text-[#1a2744] shadow-lg shadow-[#d4af37]/20"
                          : "bg-[#1a2744]/8 text-[#1a2744]/60 hover:bg-[#1a2744]/15 hover:text-[#1a2744]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleCountrySearch} className="flex items-center bg-white border border-[#d4af37]/30 rounded-full overflow-visible focus-within:border-[#d4af37] transition-all duration-300 focus-within:shadow-lg focus-within:shadow-[#d4af37]/10 shadow-sm">
                  <Search className="w-5 h-5 text-[#1a2744]/40 ml-4 shrink-0" />
                  <input
                    type="text"
                    value={countryQuery}
                    onChange={(e) => { setCountryQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search by country... e.g. Japan, Nigeria, Mexico"
                    className="flex-1 bg-transparent text-[#1a2744] placeholder-[#1a2744]/40 text-sm px-3 py-3 outline-none"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="m-1 px-5 py-2 bg-[#d4af37] text-[#1a2744] font-bold text-sm rounded-full hover:bg-[#c9a227] transition-colors shrink-0"
                  >
                    Find Cards
                  </button>
                </form>
                {showSuggestions && countrySuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {countrySuggestions.map((country) => (
                      <li key={country}>
                        <button
                          type="button"
                          onMouseDown={() => handleCountrySelect(country)}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#1a2744] hover:bg-[#f5f0e8] flex items-center gap-2 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          {country}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="/birthday"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#d4af37] text-[#1a2744] font-bold rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25 hover:shadow-[#d4af37]/40"
                >
                  Explore Cultural Connections Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/print-shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a2744] text-white font-semibold rounded-full hover:bg-[#243352] transition-all duration-200 text-sm border border-[#1a2744]/20 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Shop
                </Link>
              </div>
            </motion.div>

            {/* Right — Mother's Day card image stack */}
            <motion.div
              className="shrink-0 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative w-64 md:w-80">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-rose-300/15 rounded-3xl blur-2xl scale-110" />
                {/* Two consistent watercolor floral cards */}
                <div className="relative">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/KpEvnavSsMJWerHP.png"
                    alt="Watercolor sympathy greeting card"
                    className="absolute -top-4 -left-4 w-[85%] rounded-2xl shadow-xl border border-[#d4af37]/20 opacity-70"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/TCqTBbbbDwPDevzh.png"
                    alt="Watercolor Mother's Day greeting card"
                    className="relative w-full rounded-2xl shadow-2xl border border-white/20"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                {BRAND.logo && (
                  <img
                    src={BRAND.logo}
                    alt="Wishes Without Borders Co logo"
                    className="absolute -bottom-6 -right-6 w-20 md:w-24 object-contain drop-shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          3. SLIDING CATEGORY TILES (Carousel)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Shop Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              Celebrate Every Culture
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              From meaningful cards to engaging workbooks, explore our most loved collections designed to foster connection.
            </p>
          </motion.div>

          <div className="px-14">
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {CATEGORY_TILES.map((tile) => (
                  <CarouselItem key={tile.href} className="md:basis-1/2 lg:basis-1/4">
                    <Link href={tile.href} className="group block h-full">
                      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                          <img
                            src={tile.image}
                            alt={tile.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/400x500/1a2744/d4af37?text=${encodeURIComponent(tile.title)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          {/* Title overlay on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="text-white font-bold text-lg font-serif mb-1">{tile.title}</h3>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{tile.desc}</p>
                          </div>
                        </div>
                        {/* Shop Now arrow */}
                        <div className="px-5 py-4 mt-auto">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#d4af37] group-hover:gap-2.5 transition-all duration-200">
                            Shop Now <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          4. GLOBAL DISCOVERY SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#1a2744] py-16 md:py-24 px-4">
        {/* Decorative globe-inspired circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#d4af37]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#d4af37]/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#d4af37]/6" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Global Reach</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-5">
              Discover Products from 195 Countries
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Our AI-driven search helps you find culturally relevant greeting cards, books, and educational resources for any country in the world. Simply type a country name and discover products that authentically represent its traditions, languages, and celebrations.
            </p>
          </motion.div>

          {/* Globe-inspired diversity grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
          >
            {["Nigeria", "Japan", "Mexico", "India", "Jamaica", "Brazil", "Philippines", "Ghana", "Colombia", "Ethiopia"].map((country, i) => (
              <motion.button
                key={country}
                variants={fadeUp}
                custom={i}
                onClick={() => { window.location.href = `/birthday?country=${encodeURIComponent(country)}`; }}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d4af37]/40 rounded-xl px-4 py-3 text-center transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-[#d4af37] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">{country}</span>
              </motion.button>
            ))}
          </motion.div>

          <div className="text-center">
            <Link
              href="/birthday"
              className="group inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3.5 rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          5. CULTURAL EDUCATION PLATFORM SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f5f0e8] py-16 md:py-24 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — visual */}
            <motion.div
              className="flex-1 w-full max-w-md lg:max-w-none"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: "Modular Lessons", desc: "Country-specific units" },
                  { icon: Users, label: "Educator Guides", desc: "K\u201312 ready" },
                  { icon: Globe, label: "UNESCO-Aligned", desc: "Global frameworks" },
                  { icon: Sparkles, label: "Interactive", desc: "Hands-on activities" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dfc8]/60 text-center hover:shadow-md transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-20px" }}
                      variants={fadeUp}
                      custom={i}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <h4 className="font-bold text-[#1a2744] text-sm mb-0.5">{item.label}</h4>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right — copy */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">For Educators</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-5 leading-snug">
                Built for Classrooms, Designed for Families
              </h2>
              <p className="text-[#4a5568] text-base md:text-lg leading-relaxed mb-4">
                Our resources are meticulously designed to adapt to your unique environment. In homes, they spark bedtime conversations about distant lands and family heritage. In classrooms, they serve as foundational tools for multicultural education, helping teachers seamlessly integrate global perspectives into daily lessons.
              </p>
              <p className="text-[#4a5568] text-base md:text-lg leading-relaxed mb-8">
                Each product is crafted with modular lesson plans, educator guides, and UNESCO-aligned frameworks in mind — making it easy to bring the world into any learning space.
              </p>
              <Link
                href="/activity-workbooks"
                className="group inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3.5 rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25"
              >
                Explore Educational Tools
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          6. COUNTRY HOLIDAY CALENDAR
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Cultural Calendar</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              Never Miss a Cultural Moment
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Stay connected to celebrations around the world. Find the perfect card or resource for every upcoming holiday.
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-0">
                {HOLIDAYS.map((holiday, i) => (
                  <motion.div
                    key={`${holiday.date}-${holiday.name}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <Link
                      href={holiday.link}
                      className="group flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-[#e8dfc8]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full"
                    >
                      {/* Date badge */}
                      <div className={`${holiday.color} shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shadow-sm`}>
                        <span className="text-[10px] font-semibold uppercase leading-none">{holiday.date.split(" ")[0]}</span>
                        <span className="text-lg font-bold leading-tight">{holiday.date.split(" ")[1]}</span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1a2744] text-sm leading-tight mb-1 group-hover:text-[#d4af37] transition-colors">
                          {holiday.name}
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed flex items-start gap-1">
                          <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                          {holiday.countries}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#d4af37] shrink-0 mt-1 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          7. WHO WE SERVE
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Who We Serve</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              Find the Perfect Resources for Your Space
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Parents & Caregivers",
                desc: "Bring world cultures into your home. Explore our children\u2019s books, coloring pages, and activity workbooks designed for curious minds and inclusive families.",
                cta: "Shop for Families",
                href: "/birthday",
                gradient: "from-rose-400 to-pink-600",
              },
              {
                icon: BookOpenCheck,
                title: "Teachers & Counselors",
                desc: "Enrich your curriculum with authentic representation. Discover classroom-ready workbooks, flashcards, and tools crafted specifically for K\u201312 multicultural education and counseling environments.",
                cta: "Shop for Classrooms",
                href: "/activity-workbooks",
                gradient: "from-indigo-400 to-blue-600",
              },
              {
                icon: School,
                title: "Schools & Districts",
                desc: "Build a truly inclusive community. Learn about our bulk ordering options and culturally responsive resources designed to support your entire district\u2019s diversity initiatives.",
                cta: "View School Solutions",
                href: "/activity-workbooks",
                gradient: "from-emerald-400 to-teal-600",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#e8dfc8]/60 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-[#1a2744] text-lg font-serif mb-3">{card.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">{card.desc}</p>
                    <Link
                      href={card.href}
                      className="group inline-flex items-center gap-2 bg-[#1a2744] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#243352] transition-all duration-200 text-sm self-start"
                    >
                      {card.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          8. BRAND STORY
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#faf8f4] py-16 md:py-24 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl translate-y-1/3" />

        <motion.div
          className="relative max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          custom={0}
        >
          <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-6 leading-snug">
            Created for Connection
          </h2>
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed mb-5">
            Representation matters. Wishes Without Borders Co. was born from a simple but powerful belief: every child deserves to see their culture celebrated, and every student benefits from learning about the world around them.
          </p>
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed mb-8">
            Designed by a global-minded educator and parent, our products are crafted with deep cultural respect, accuracy, and love. Whether you are building a diverse classroom library, seeking resources for your counseling office, or looking for the perfect card for a loved one, we are here to help you foster genuine global connection.
          </p>
          <Link
            href="/birthday"
            className="group inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3.5 rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25"
          >
            Read Our Story
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          9. TRUST SECTION — Stats, Testimonials, Multi-Channel
          ══════════════════════════════════════════════════════════════════════ */}
      {/* Trust badges / stats bar */}
      <section className="bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Globe, label: "195 Countries" },
              { icon: Download, label: "Instant Digital Downloads" },
              { icon: Printer, label: "Print at Home or Ship" },
              { icon: Heart, label: "Culturally Authentic Designs" },
              { icon: ShieldCheck, label: "WCAG Accessible" },
              { icon: BookOpenCheck, label: "Educator-Aligned" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center justify-center gap-2 text-[#1a2744] py-1">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Love From Our Community</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 text-base">Real stories from families around the world</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I sent my Nigerian grandmother a birthday card in Yoruba and she cried happy tears. She said it was the most thoughtful gift she\u2019d ever received.",
                name: "Adaeze O.",
                location: "Houston, TX",
                card: "Nigerian Birthday Card",
              },
              {
                quote: "Finally a card that actually represents my culture. The Mexican Mother\u2019s Day card was absolutely beautiful \u2014 my mom framed it.",
                name: "Sofia R.",
                location: "Los Angeles, CA",
                card: "Mexican Mother\u2019s Day Card",
              },
              {
                quote: "I use the activity workbooks in my 4th grade classroom. My students love learning about different countries. The quality is outstanding.",
                name: "Ms. Tamara K.",
                location: "Atlanta, GA",
                card: "Activity Workbooks",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm border border-[#e8dfc8]/60 flex flex-col hover:shadow-md transition-shadow duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-4 border-t border-[#e8dfc8]/60">
                  <p className="font-bold text-[#1a2744] text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location} &middot; <span className="text-[#d4af37]">{t.card}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-channel strip */}
      <section className="bg-[#f5f0e8] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-[#1a2744] font-bold font-serif text-xl mb-6">Find Us Wherever You Shop</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { name: "Website", desc: "Official Store", icon: Globe },
              { name: "Gumroad", desc: "Digital Downloads", icon: Download },
              { name: "Amazon", desc: "Fast Shipping", icon: Gift },
              { name: "Teachers Pay Teachers", desc: "Classroom Resources", icon: BookOpenCheck },
            ].map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.name}
                  className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-[#e8dfc8]/60"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#1a2744] text-sm">{channel.name}</p>
                    <p className="text-gray-400 text-xs">{channel.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          10. FOOTER (preserved exactly)
          ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#1a2744]">
        {/* Newsletter */}
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
          <div className="max-w-md mx-auto text-center mb-12">
            <h3 className="text-white font-bold font-serif text-xl mb-2">Stay in the Loop</h3>
            <p className="text-white/50 text-sm mb-5">New countries and products added every month. Be the first to know.</p>
            {footerSubmitted ? (
              <p className="text-[#d4af37] font-semibold text-sm">You&rsquo;re on the list &mdash; we&rsquo;ll be in touch!</p>
            ) : (
              <form onSubmit={handleFooterSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="submit"
                  disabled={footerSubscribe.isPending}
                  className="bg-[#d4af37] text-[#1a2744] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#c9a227] transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {footerSubscribe.isPending ? "..." : "Notify Me"}
                </button>
              </form>
            )}
          </div>

          {/* Footer links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm border-t border-white/10 pt-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#d4af37]" />
                <span className="text-white font-bold">Wishes Without Borders Co</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Multicultural greeting cards, children&rsquo;s books &amp; educational tools. All products are instant digital downloads.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2">
                <li><Link href="/birthday" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Greeting Cards</Link></li>
                <li><Link href="/graduation" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Graduation Cards</Link></li>
                <li><Link href="/print-shop" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Print Shop</Link></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Learn</h4>
              <ul className="space-y-2">
                <li><Link href="/activity-workbooks" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Activity Workbooks</Link></li>
                <li><Link href="/flashcards" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Flashcards</Link></li>
                <li><Link href="/coloring-books" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Coloring Books</Link></li>
                <li><Link href="/cookbooks" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Cookbooks</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@wisheswithoutbordersco.com" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">
                    Contact Us
                  </a>
                </li>
                <li><Link href="/privacy-policy" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Wishes Without Borders Co. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-[#d4af37] transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-[#d4af37] transition-colors">Terms</Link>
              <a href="mailto:info@wisheswithoutbordersco.com" className="hover:text-[#d4af37] transition-colors">
                info@wisheswithoutbordersco.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
