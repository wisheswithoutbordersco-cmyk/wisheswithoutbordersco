import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BRAND } from "@/lib/productData";
import { Globe, BookOpen, Baby, Heart, GraduationCap, Star, Flower2, Sun, Smile, Ribbon, Search, Sparkles, Printer, ArrowRight, Gift, Palette, BookOpenCheck, CookingPot, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";

/* ─── Browse-by-Category data (no hardcoded counts) ─────────────────────── */
const BROWSE_CATEGORIES = [
  {
    href: "/birthday",
    title: "Greeting Cards",
    desc: "Birthday, Anniversary, Sympathy & more — celebrating every culture",
    icon: Heart,
    gradient: "from-rose-400 to-pink-600",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/ng_birthday_mom_9686a463.png",
  },
  {
    href: "/graduation",
    title: "Graduation Cards",
    desc: "Celebrate every graduate's achievement across cultures",
    icon: GraduationCap,
    gradient: "from-indigo-400 to-blue-600",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/australia_graduation_boy_41de4040.png",
  },
  {
    href: "/activity-workbooks",
    title: "Activity Workbooks",
    desc: "Fun cultural learning adventures for kids & families",
    icon: BookOpenCheck,
    gradient: "from-emerald-400 to-teal-600",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/uk_birthday_mom_35350808.png",
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    desc: "World flags, capitals & cultural facts for curious minds",
    icon: Sparkles,
    gradient: "from-amber-400 to-orange-500",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/vYYfbXYjRUfVnqPN.png",
  },
  {
    href: "/coloring-books",
    title: "Coloring Books",
    desc: "Cultural art journeys for all ages — Africa & Americas editions",
    icon: Palette,
    gradient: "from-violet-400 to-purple-600",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/WrIfhPVqyZhBjgwM.png",
  },
  {
    href: "/cookbooks",
    title: "Cookbooks",
    desc: "Multicultural recipes that bring the world to your kitchen",
    icon: CookingPot,
    gradient: "from-red-400 to-rose-600",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663477175297/LPvccSfHERCffTVq.png",
  },
  {
    href: "/baby-shower",
    title: "Baby Shower Games",
    desc: "Printable game packs for a multicultural celebration",
    icon: Baby,
    gradient: "from-pink-400 to-fuchsia-500",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/australia_graduation_congrats_536f42b4.png",
  },
  {
    href: "/print-shop",
    title: "Print Shop",
    desc: "Physical wall art posters — printed & shipped to your door",
    icon: Printer,
    gradient: "from-sky-400 to-cyan-600",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BH_birthday_mom_wall_art_8x10_427a59ed.jpg",
  },
  {
    href: "/children-books",
    title: "Children's Books",
    desc: "Illustrated stories celebrating cultures from around the world",
    icon: BookOpen,
    gradient: "from-lime-400 to-green-600",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/uk_birthday_mom_35350808.png",
  },
];

/* ─── Card-occasion categories (icon grid) ──────────────────────────────── */
const CATEGORIES = [
  { href: "/birthday",        icon: Star,          title: "Birthday Cards",        desc: "For Mom, Dad, Son & Daughter", color: "bg-[#c0392b]" },
  { href: "/anniversary",     icon: Heart,          title: "Anniversary Cards",     desc: "Celebrate love & commitment",  color: "bg-[#8e44ad]" },
  { href: "/graduation",      icon: GraduationCap,  title: "Graduation Cards",      desc: "Boy, Girl & Congrats designs", color: "bg-[#1a3a5c]" },
  { href: "/congratulations", icon: Smile,          title: "Congratulations",       desc: "Vibrant celebration designs",  color: "bg-[#27ae60]" },
  { href: "/thank-you",       icon: Ribbon,         title: "Thank You Cards",       desc: "Express gratitude beautifully", color: "bg-[#d4af37]" },
  { href: "/thinking-of-you", icon: Flower2,        title: "Thinking of You",       desc: "Let someone know you care",    color: "bg-[#2980b9]" },
  { href: "/get-well",        icon: Sun,            title: "Get Well Soon",         desc: "Send healing wishes",          color: "bg-[#e67e22]" },
  { href: "/sympathy",        icon: Heart,          title: "Sympathy Cards",        desc: "Comfort & compassion",         color: "bg-[#7f8c8d]" },
  { href: "/mothers-day",     icon: Flower2,        title: "Mother's Day",          desc: "Honor moms worldwide",         color: "bg-[#e91e8c]" },
  { href: "/fathers-day",     icon: Star,           title: "Father's Day",          desc: "Celebrate dads everywhere",    color: "bg-[#1a2744]" },
  { href: "/new-year",        icon: Sparkles,       title: "Happy New Year",        desc: "Ring in the New Year",         color: "bg-[#b8860b]" },
  { href: "/print-shop",      icon: Printer,        title: "Print Shop",            desc: "Physical wall art prints",     color: "bg-[#2c3e50]" },
  { href: "/baby-shower",     icon: Baby,           title: "Baby Shower Games",     desc: "Print-at-home game packs",     color: "bg-[#8b1a4a]" },
];

/* ─── Country list for search ───────────────────────────────────────────── */
const ALL_COUNTRIES = ["Afghanistan","Albania","Algeria","Angola","Antigua","Argentina","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Cambodia","Cameroon","Canada","Cape Verde","Chad","Chile","China","Colombia","Comoros","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Curacao","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary","India","Indonesia","Iran","Iraq","Ireland","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malaysia","Maldives","Mali","Marshall Islands","Martinique","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda","Saint Kitts","Saint Lucia","Saint Vincent","Samoa","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor Leste","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","UAE","USA","Uganda","Ukraine","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Western Sahara","Yemen","Zambia","Zimbabwe"];

/* ─── Subtle fade-in animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

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
    { key: "mothers-day",     label: "Mother's Day" },
    { key: "fathers-day",     label: "Father's Day" },
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


  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />

      {/* ════════════════════════════════════════════════════════════════════
          HERO — warm gradient, family-oriented, multicultural
          ════════════════════════════════════════════════════════════════════ */}
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
              <div className="inline-flex items-center gap-2 bg-[#1a2744]/8 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-6">
                <Globe className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[#d4af37] font-semibold text-xs uppercase tracking-widest">Wishes Without Borders Co</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-[#1a2744] leading-tight mb-5">
                Celebrate Every Culture,{" "}
                <span className="bg-gradient-to-r from-[#d4af37] via-amber-500 to-[#c9a227] bg-clip-text text-transparent">
                  Connect Every Heart
                </span>
              </h1>
              <p className="text-[#4a5568] text-lg md:text-xl max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
                Multicultural greeting cards, children's books, activity workbooks, and wall art — designed for families who cherish cultural connection and togetherness.
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
                  Browse All Cards
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

            {/* Right — logo + decorative card stack */}
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

      {/* ════════════════════════════════════════════════════════════════════
          TRUST BAR — warm, no hardcoded counts
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37]">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[#1a2744] text-xs font-semibold">
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 195 Countries Represented</span>
          <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Instant Digital Downloads</span>
          <span className="flex items-center gap-1.5"><Printer className="w-3.5 h-3.5" /> Print at Home or Ship</span>
          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Culturally Authentic Designs</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MISSION STATEMENT — warm & inviting
          ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          custom={0}
        >
          <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-5 leading-snug">
            Every family deserves to see their culture celebrated
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            At Wishes Without Borders Co, we create products that honor the beauty of every culture. From greeting cards in 195 countries to children's books, activity workbooks, and wall art — we help families connect with their roots and share their heritage with the next generation.
          </p>
        </motion.div>
      </section>


      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          BROWSE BY CATEGORY — visual image grid (all 9 categories)
          ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Shop Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              From instant digital downloads to physical wall art — find the perfect way to celebrate every culture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BROWSE_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.href}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link
                    href={cat.href}
                    className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 h-full"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/400x250/1a2744/d4af37?text=${encodeURIComponent(cat.title)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      {/* Floating icon badge */}
                      <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Text */}
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-[#1a2744] text-base mb-1">{cat.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1">{cat.desc}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[#d4af37] group-hover:gap-2 transition-all duration-200">
                        Shop now <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          ALL CARD OCCASIONS — compact icon grid
          ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Every Occasion</span>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1a2744] mb-2">
              Find the Perfect Card
            </h2>
            <p className="text-gray-500 text-sm">
              Greeting cards for every occasion — starting at $5.99 per digital download.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.href}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link
                    href={cat.href}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-[#e8dfc8]/60 p-4 flex flex-col items-center text-center hover:-translate-y-0.5"
                  >
                    <div className={`w-11 h-11 rounded-full ${cat.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-[#1a2744] text-xs leading-tight mb-0.5">{cat.title}</h3>
                    <p className="text-gray-400 text-[10px] leading-tight">{cat.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f5f0e8]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto py-16 md:py-20 px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Simple &amp; Easy</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              How It Works
            </h2>
            <p className="text-[#4a5568] text-base max-w-md mx-auto">
              Get your card in 3 easy steps — no shipping, no waiting.
            </p>          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Browse & Choose",
                desc: "Explore cards by country, occasion, or culture. Find the perfect design that speaks to your heritage.",
              },
              {
                step: "02",
                icon: Gift,
                title: "Secure Checkout",
                desc: "Complete your purchase securely. Your PDF downloads instantly — no account required.",
              },
              {
                step: "03",
                icon: Printer,
                title: "Print & Celebrate",
                desc: "Print at home on any printer, or send digitally by email or text. Ready in minutes.",
              },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="flex flex-col items-center text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center">
                      <StepIcon className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-[#d4af37] text-[#1a2744] text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-[#1a2744] font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#4a5568] text-sm leading-relaxed max-w-xs">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/birthday"
              className="group inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3.5 rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f4] py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[#d4af37] font-semibold text-xs uppercase tracking-widest mb-3">Love From Our Community</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 text-base">Real stories from families around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I sent my Nigerian grandmother a birthday card in Yoruba and she cried happy tears. She said it was the most thoughtful gift she'd ever received.",
                name: "Adaeze O.",
                location: "Houston, TX",
                card: "Nigerian Birthday Card",
              },
              {
                quote: "Finally a card that actually represents my culture. The Mexican Mother's Day card was absolutely beautiful — my mom framed it.",
                name: "Sofia R.",
                location: "Los Angeles, CA",
                card: "Mexican Mother's Day Card",
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

      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          PRINT SHOP CTA
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#faf8f4]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl translate-y-1/3" />
        <div className="relative max-w-4xl mx-auto py-16 md:py-20 px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-6">
              <ImageIcon className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#d4af37] font-semibold text-xs uppercase tracking-widest">New: Print Shop</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1a2744] mb-4">
              Physical Wall Art, Delivered to Your Door
            </h2>
            <p className="text-[#4a5568] text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Turn your favorite multicultural designs into beautiful wall art. Printed on premium paper and shipped worldwide via Gelato — perfect for nurseries, classrooms, and living rooms.
            </p>
            <Link
              href="/print-shop"
              className="group inline-flex items-center gap-2 bg-[#d4af37] text-[#1a2744] font-bold px-8 py-3.5 rounded-full hover:bg-[#c9a227] transition-all duration-200 text-sm shadow-lg shadow-[#d4af37]/25"
            >
              <Printer className="w-4 h-4" />
              Explore the Print Shop
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#1a2744]">
        {/* Newsletter */}
        <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
          <div className="max-w-md mx-auto text-center mb-12">
            <h3 className="text-white font-bold font-serif text-xl mb-2">Stay in the Loop</h3>
            <p className="text-white/50 text-sm mb-5">New countries and products added every month. Be the first to know.</p>
            {footerSubmitted ? (
              <p className="text-[#d4af37] font-semibold text-sm">You're on the list — we'll be in touch!</p>
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
                Multicultural greeting cards, children's books & educational tools. All products are instant digital downloads.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2">
                <li><Link href="/birthday" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Greeting Cards</Link></li>
                <li><Link href="/graduation" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Graduation Cards</Link></li>
                <li><Link href="/baby-shower" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Baby Shower Games</Link></li>
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
                <li><Link href="/children-books" className="text-white/50 hover:text-[#d4af37] transition-colors text-xs">Children's Books</Link></li>
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
