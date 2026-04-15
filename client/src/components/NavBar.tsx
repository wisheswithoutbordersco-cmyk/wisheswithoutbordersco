import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe, ShoppingCart, ChevronDown, Package, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// ── Section 1: Greeting Cards dropdown ────────────────────────────────────
const GREETING_CARDS_LINKS = [
  { href: "/birthday",        label: "Birthday" },
  { href: "/anniversary",     label: "Anniversary" },
  { href: "/graduation",      label: "Graduation" },
  { href: "/congratulations", label: "Congratulations" },
  { href: "/thank-you",       label: "Thank You" },
  { href: "/thinking-of-you", label: "Thinking of You" },
  { href: "/get-well",        label: "Get Well Soon" },
  { href: "/sympathy",        label: "Sympathy" },
  { href: "/mothers-day",     label: "Mother's Day" },
  { href: "/fathers-day",     label: "Father's Day" },
  { href: "/new-year",        label: "New Year" },
  { href: "/in-loving-memory",label: "In Loving Memory" },
];

// ── Section 2: Wall Art dropdown ──────────────────────────────────────────
const WALL_ART_LINKS = [
  { href: "/wall-art",        label: "Cultural Wall Art" },
];

// ── Section 3: Bundles dropdown ───────────────────────────────────────────
const BUNDLES_LINKS = [
  { href: "/baby-shower",         label: "Baby Shower Games" },
  { href: "/activity-workbooks",  label: "Activity Workbooks" },
  { href: "/flashcards",          label: "Flashcards" },
  { href: "/coloring-books",      label: "Coloring Books" },
  { href: "/cookbooks",           label: "Cookbooks" },
  { href: "/kids-classroom",      label: "Kids & Classroom" },
  { href: "/global-vibes",        label: "Global Vibes" },
];

// ── Section 4: Books dropdown ────────────────────────────────────────────
const BOOKS_LINKS = [
  { href: "/books",               label: "Books Home" },
  { href: "/books/childrens",     label: "Children's Books" },
  { href: "/books/early-readers", label: "Early Readers" },
  { href: "/books/storybooks",    label: "Cultural Storybooks" },
];

// ── Section 5: Education dropdown ─────────────────────────────────────────
const EDUCATION_LINKS = [
  { href: "/education",                      label: "Education Home" },
  { href: "/education/sel-kits",             label: "SEL Kits" },
  { href: "/education/classroom-resources",  label: "Classroom Resources" },
  { href: "/education/coloring-pages",       label: "Coloring Pages" },
  { href: "/education/worksheets",           label: "Worksheets" },
  { href: "/flashcards",                     label: "Flashcards" },
  { href: "/activity-workbooks",             label: "Activity Workbooks" },
];

// ── Section 6: Collections dropdown ───────────────────────────────────────
const COLLECTIONS_LINKS = [
  { href: "/collections",                      label: "All Collections" },
  { href: "/collections/best-sellers",         label: "Best Sellers" },
  { href: "/collections/new-arrivals",         label: "New Arrivals" },
  { href: "/collections/editors-picks",        label: "Editor's Picks" },
  { href: "/collections/cultural",             label: "Cultural Collections" },
  { href: "/collections/seasonal",             label: "Seasonal" },
  { href: "/collections/teacher-favorites",    label: "Teacher Favorites" },
  { href: "/collections/kids-favorites",       label: "Kids' Favorites" },
];

// ── Section 7: Print Shop dropdown ────────────────────────────────────────
const PRINT_SHOP_LINKS = [
  { href: "/print-shop",                  label: "Print Shop Home" },
  { href: "/print-shop/wall-art",         label: "Wall Art" },
  { href: "/print-shop/country",          label: "Country Prints" },
  { href: "/print-shop/kids",             label: "Kids' Room" },
  { href: "/print-shop/holidays",         label: "Holiday Prints" },
  { href: "/print-shop/teacher",          label: "Teacher Prints" },
  { href: "/print-shop/special-editions", label: "Special Editions" },
];

interface DropdownProps {
  label: string;
  links: { href: string; label: string }[];
  location: string;
  onNavigate?: () => void;
  badge?: string;
}

function Dropdown({ label, links, location, onNavigate, badge }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = links.some((l) => l.href === location);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ${
          isActive
            ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
            : "text-white/80 hover:text-[#C9A86A]"
        }`}
      >
        {label}
        {badge && (
          <span className="ml-1 bg-[#C9A86A] text-[#0A1A2F] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#12203a] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[200px] py-1.5 overflow-hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`block px-4 py-2 text-sm transition-colors ${
                location === l.href
                  ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-[#C9A86A]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { count, openCart } = useCart();

  return (
    <nav className="bg-[#0A1A2F] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Globe className="w-6 h-6 text-[#C9A86A]" />
          <span className="font-serif font-bold text-lg text-white leading-tight">
            Wishes{" "}
            <span className="text-[#C9A86A]">Without Borders</span>
          </span>
        </Link>

        {/* Desktop nav — 4 sections */}
        <div className="hidden lg:flex items-center gap-1">
          <Dropdown label="Greeting Cards" links={GREETING_CARDS_LINKS} location={location} />
          <Dropdown label="Wall Art" links={WALL_ART_LINKS} location={location} />
          <Dropdown label="Bundles" links={BUNDLES_LINKS} location={location} />
          <Dropdown label="Books" links={BOOKS_LINKS} location={location} />
          <Dropdown label="Education" links={EDUCATION_LINKS} location={location} />
          <Dropdown label="Collections" links={COLLECTIONS_LINKS} location={location} />
          <Dropdown label="Print Shop" links={PRINT_SHOP_LINKS} location={location} badge="New" />
        </div>

        {/* My Orders + Cart + Mobile hamburger */}
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="hidden lg:flex items-center gap-1 p-2 text-white/80 hover:text-[#C9A86A] transition-colors text-sm"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            href="/my-orders"
            className="hidden lg:flex items-center gap-1 p-2 text-white/80 hover:text-[#C9A86A] transition-colors text-sm"
          >
            <Package className="w-4 h-4" />
            <span className="text-xs">Orders</span>
          </Link>
          <button
            onClick={openCart}
            className="relative p-2 text-white/80 hover:text-[#C9A86A] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C9A86A] text-[#0A1A2F] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — 4 sections */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#12203a] border-t border-white/10 px-4 py-4 space-y-4">
          {/* Greeting Cards */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Greeting Cards
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {GREETING_CARDS_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Wall Art */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Wall Art
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {WALL_ART_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Bundles */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Bundles
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {BUNDLES_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Books */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">Books</p>
            <div className="grid grid-cols-2 gap-1.5">
              {BOOKS_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold" : "text-white/80 hover:bg-white/10"
                  }`}>{l.label}</Link>
              ))}
            </div>
          </div>
          {/* Education */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">Education</p>
            <div className="grid grid-cols-2 gap-1.5">
              {EDUCATION_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold" : "text-white/80 hover:bg-white/10"
                  }`}>{l.label}</Link>
              ))}
            </div>
          </div>
          {/* Collections */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">Collections</p>
            <div className="grid grid-cols-2 gap-1.5">
              {COLLECTIONS_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold" : "text-white/80 hover:bg-white/10"
                  }`}>{l.label}</Link>
              ))}
            </div>
          </div>
          {/* Print Shop */}
          <div>
            <p className="text-[#C9A86A] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Print Shop <span className="bg-[#C9A86A] text-[#0A1A2F] text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">New</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRINT_SHOP_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#C9A86A] text-[#0A1A2F] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* My Orders — mobile */}
          <div className="border-t border-white/10 pt-3">
            <Link
              href="/my-orders"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-white/80 hover:bg-white/10 hover:text-[#C9A86A] transition-colors"
            >
              <Package className="w-4 h-4 text-[#C9A86A]" />
              My Orders
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
