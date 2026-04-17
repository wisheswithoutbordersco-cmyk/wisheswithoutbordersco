import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe, ShoppingCart, ChevronDown, Printer } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// ── Greeting Cards dropdown ────────────────────────────────────────────────
const CARD_LINKS = [
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

// ── Books & Resources dropdown ─────────────────────────────────────────────
const BOOKS_LINKS = [
  { href: "/activity-workbooks",  label: "Activity Workbooks" },
  { href: "/flashcards",          label: "Flashcards" },
  { href: "/coloring-books",      label: "Coloring Books" },
  { href: "/cookbooks",           label: "Cookbooks" },
  { href: "/wall-art",            label: "Wall Art" },
  { href: "/kids-classroom",      label: "Kids & Classroom" },
];

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
            : "text-white/80 hover:text-[#d4af37]"
        }`}
      >
        {label}
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
                  ? "bg-[#d4af37] text-[#1a2744] font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-[#d4af37]"
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
    <nav className="bg-[#1a2744] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Globe className="w-6 h-6 text-[#d4af37]" />
          <span className="font-serif font-bold text-lg text-white leading-tight">
            Wishes{" "}
            <span className="text-[#d4af37]">Without Borders</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Dropdown label="Greeting Cards" links={CARD_LINKS} location={location} />
          <Dropdown label="Books & Resources" links={BOOKS_LINKS} location={location} />
          {/* Print Shop — prominent gold standalone link */}
          <Link
            href="/print-shop"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              location === "/print-shop"
                ? "bg-[#d4af37] text-[#1a2744]"
                : "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#1a2744]"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Print Shop
          </Link>
        </div>

        {/* Cart + Mobile hamburger */}
        <div className="flex items-center gap-1">
          <button
            onClick={openCart}
            className="relative p-2 text-white/80 hover:text-[#d4af37] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-[#1a2744] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
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

      {/* Mobile dropdown — three sections */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#12203a] border-t border-white/10 px-4 py-4 space-y-4">
          {/* Print Shop — prominent gold pill at top of mobile menu */}
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
            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Greeting Cards
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CARD_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#d4af37] text-[#1a2744] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Books & Resources */}
          <div>
            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Books &amp; Resources
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {BOOKS_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm text-center transition-colors ${
                    location === l.href
                      ? "bg-[#d4af37] text-[#1a2744] font-semibold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
