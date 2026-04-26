import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Globe,
  ShoppingCart,
  ChevronDown,
  Printer,
  Search,
  BookOpen,
  Compass,
  GraduationCap,
  School,
  PenLine,
  CalendarHeart,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

/* ── Greeting Cards dropdown ──────────────────────────────────────────── */
const CARD_LINKS = [
  { href: "/birthday",        label: "Birthday" },
  { href: "/anniversary",     label: "Anniversary" },
  { href: "/graduation",      label: "Graduation" },
  { href: "/congratulations", label: "Congratulations" },
  { href: "/thank-you",       label: "Thank You" },
  { href: "/thinking-of-you", label: "Thinking of You" },
  { href: "/get-well",        label: "Get Well Soon" },
  { href: "/sympathy",        label: "Sympathy" },
  { href: "/mothers-day",     label: "Mother\u2019s Day" },
  { href: "/fathers-day",     label: "Father\u2019s Day" },
  { href: "/new-year",        label: "New Year" },
  { href: "/in-loving-memory",label: "In Loving Memory" },
];

/* ── Books & Resources dropdown ───────────────────────────────────────── */
const BOOKS_LINKS = [
  { href: "/activity-workbooks",  label: "Activity Workbooks" },
  { href: "/flashcards",          label: "Flashcards" },
  { href: "/coloring-books",      label: "Coloring Books" },
  { href: "/cookbooks",           label: "Cookbooks" },
  { href: "/wall-art",            label: "Wall Art" },
  { href: "/kids-classroom",      label: "Kids & Classroom" },
];

/* ── Top utility bar links ────────────────────────────────────────────── */
const UTILITY_LINKS = [
  { href: "https://www.amazon.com/s?k=wishes+without+borders", label: "Amazon", external: true },
  { href: "/print-shop",  label: "Print Shop", external: false },
  { href: "/about",        label: "About",      external: false },
  { href: "/contact",      label: "Contact",    external: false },
];

/* ── Main nav links (Row 2) ───────────────────────────────────────────── */
const MAIN_NAV_LINKS = [
  { href: "/start-here",         label: "Start Here",         icon: Compass },
  { href: "/children-books",     label: "Global Kids Series", icon: BookOpen },
  { href: "/bridge-kit",         label: "Bridge Kit",         icon: GraduationCap },
  { href: "/schools",            label: "Schools",            icon: School },
  { href: "/blog",               label: "Blog",               icon: PenLine },
  { href: "/holidays",           label: "Holidays",           icon: CalendarHeart },
  { href: "/all-categories",     label: "All Categories",     icon: LayoutGrid },
];

/* ── Desktop dropdown component ───────────────────────────────────────── */
interface DropdownProps {
  label: string;
  links: { href: string; label: string }[];
  location: string;
  onNavigate?: () => void;
}

function Dropdown({ label, links, location, onNavigate }: DropdownProps) {
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
            ? "bg-[#d4af37] text-[#1a2744] font-semibold"
            : "text-[#1a2744]/70 hover:text-[#d4af37]"
        }`}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#e8dfc8] rounded-xl shadow-2xl z-50 min-w-[220px] py-1.5 overflow-hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                location === l.href
                  ? "bg-[#d4af37]/10 text-[#d4af37] font-semibold"
                  : "text-[#1a2744]/80 hover:bg-[#faf5eb] hover:text-[#d4af37]"
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

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR COMPONENT — Two-row navigation
   Row 1: Dark navy utility bar (Amazon, Print Shop, About, Contact)
   Row 2: Cream main nav with icons (Start Here, Global Kids, etc.)
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { count, openCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 shadow-lg">
      {/* ── ROW 1: Top Utility Bar (dark navy) ─────────────────────────── */}
      <div className="bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Globe className="w-5 h-5 text-[#d4af37] group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="font-serif font-bold text-sm text-white leading-tight hidden sm:inline">
              Wishes{" "}
              <span className="text-[#d4af37]">Without Borders</span>
            </span>
          </Link>

          {/* Right: Utility links */}
          <div className="hidden md:flex items-center gap-1">
            {UTILITY_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 text-xs text-white/70 hover:text-[#d4af37] transition-colors duration-200"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1 text-xs transition-colors duration-200 ${
                    location === link.href
                      ? "text-[#d4af37] font-semibold"
                      : "text-white/70 hover:text-[#d4af37]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={openCart}
              className="relative p-1.5 text-white/80 hover:text-[#d4af37] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-[#1a2744] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
            <button
              className="p-1.5 text-white/80 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Main Navigation Bar (cream/light) ───────────────────── */}
      <div className="hidden md:block bg-[#faf8f4] border-b border-[#e8dfc8]/60">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-11">
          {/* Left: Main nav links with icons */}
          <div className="flex items-center gap-0.5">
            {MAIN_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-[#d4af37]/10 text-[#d4af37] font-semibold"
                      : "text-[#1a2744]/65 hover:text-[#d4af37] hover:bg-[#d4af37]/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Dropdowns + Cart */}
          <div className="flex items-center gap-1">
            <Dropdown
              label="Greeting Cards"
              links={CARD_LINKS}
              location={location}
            />
            <Dropdown
              label="Books & Resources"
              links={BOOKS_LINKS}
              location={location}
            />
            <Link
              href="/print-shop"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                location === "/print-shop"
                  ? "bg-[#d4af37] text-[#1a2744]"
                  : "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#1a2744]"
              }`}
            >
              <Printer className="w-3 h-3" />
              Print Shop
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-[#1a2744]/60 hover:text-[#d4af37] transition-colors ml-1"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-[#1a2744] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#e8dfc8] shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Utility links */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-[#e8dfc8]">
              {UTILITY_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[#1a2744] text-white/80 hover:text-[#d4af37] transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      location === link.href
                        ? "bg-[#d4af37] text-[#1a2744] font-semibold"
                        : "bg-[#1a2744] text-white/80 hover:text-[#d4af37]"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Main nav links */}
            <div>
              <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">
                Explore
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {MAIN_NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        location === link.href
                          ? "bg-[#d4af37]/10 text-[#d4af37] font-semibold"
                          : "text-[#1a2744]/70 hover:bg-[#faf5eb] hover:text-[#d4af37]"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#d4af37]/60" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Print Shop — prominent gold pill */}
            <Link
              href="/print-shop"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-[#d4af37] text-[#1a2744] font-bold text-sm"
            >
              <Printer className="w-4 h-4" />
              Print Shop
            </Link>

            {/* Greeting Cards */}
            <div>
              <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">
                Greeting Cards
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {CARD_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm text-center transition-colors ${
                      location === l.href
                        ? "bg-[#d4af37]/10 text-[#d4af37] font-semibold"
                        : "text-[#1a2744]/70 hover:bg-[#faf5eb]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Books & Resources */}
            <div>
              <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">
                Books &amp; Resources
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {BOOKS_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm text-center transition-colors ${
                      location === l.href
                        ? "bg-[#d4af37]/10 text-[#d4af37] font-semibold"
                        : "text-[#1a2744]/70 hover:bg-[#faf5eb]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
