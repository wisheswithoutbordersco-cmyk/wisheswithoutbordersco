import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CategoryShellPageProps {
  title: string;
  subtitle: string;
  whisper?: string;
  breadcrumbs: BreadcrumbItem[];
  filterOptions?: string[];
  sortOptions?: string[];
  comingSoonLabel?: string;
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6" style={{ color: "rgba(201,168,106,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-40">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#C9A86A] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "#C9A86A" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function CategoryShellPage({
  title,
  subtitle,
  whisper,
  breadcrumbs,
  filterOptions = ["All", "New Arrivals", "Best Sellers", "Featured"],
  sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"],
  comingSoonLabel = "Products Coming Soon",
}: CategoryShellPageProps) {
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "#0A1A2F" }}>
        {whisper && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="text-[10vw] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: "rgba(201,168,106,0.04)", fontFamily: "'Playfair Display', serif" }}
            >
              {whisper}
            </span>
          </div>
        )}
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <Breadcrumbs items={breadcrumbs} />
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: "#C9A86A" }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt, i) => (
              <button
                key={opt}
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={
                  i === 0
                    ? { background: "#C9A86A", color: "#0A1A2F", borderColor: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }
                    : { background: "transparent", color: "#0A1A2F", borderColor: "rgba(10,26,47,0.2)", fontFamily: "'DM Sans', sans-serif" }
                }
              >
                {opt}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select
            className="px-3 py-1.5 rounded border text-sm"
            style={{ borderColor: "rgba(10,26,47,0.2)", color: "#0A1A2F", background: "#fff", fontFamily: "'DM Sans', sans-serif" }}
            aria-label="Sort products"
          >
            {sortOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid — Coming Soon Placeholder */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-24 text-center"
          style={{ borderColor: "rgba(201,168,106,0.3)", background: "rgba(201,168,106,0.04)" }}
        >
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
            {comingSoonLabel}
          </h2>
          <div className="w-12 h-0.5 mx-auto mb-3" style={{ background: "#C9A86A" }} />
          <p className="text-sm max-w-sm" style={{ color: "rgba(10,26,47,0.5)" }}>
            We're adding products to this collection. Check back soon or subscribe to be notified.
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2.5 rounded text-sm font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5"
            style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
          >
            Explore What's Live
          </Link>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[1, 2, 3, "...", 12].map((p, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded text-sm font-medium border transition-colors"
              style={
                p === 1
                  ? { background: "#C9A86A", color: "#0A1A2F", borderColor: "#C9A86A" }
                  : { background: "transparent", color: "#0A1A2F", borderColor: "rgba(10,26,47,0.2)" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SEO meta placeholder (comment) */}
      
    </div>
  );
}

// ── Books ──────────────────────────────────────────────────────────────────

export function ChildrensBooksPage() {
  return (
    <CategoryShellPage
      title="Children's Books"
      subtitle="Multicultural stories for curious young minds — celebrating cultures from around the world."
      whisper="Books"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Books", href: "/books" }, { label: "Children's Books" }]}
      filterOptions={["All", "Ages 3–5", "Ages 6–8", "Ages 9–12", "Board Books"]}
      comingSoonLabel="Children's Books Coming Soon"
    />
  );
}

export function EarlyReadersPage() {
  return (
    <CategoryShellPage
      title="Early Readers"
      subtitle="Simple, engaging stories to build reading confidence and cultural awareness."
      whisper="Early Readers"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Books", href: "/books" }, { label: "Early Readers" }]}
      filterOptions={["All", "Level 1", "Level 2", "Level 3"]}
      comingSoonLabel="Early Readers Coming Soon"
    />
  );
}

export function CulturalStorybooksPage() {
  return (
    <CategoryShellPage
      title="Cultural Storybooks"
      subtitle="Rich, immersive stories rooted in the traditions, folklore, and celebrations of cultures worldwide."
      whisper="Storybooks"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Books", href: "/books" }, { label: "Cultural Storybooks" }]}
      filterOptions={["All", "Africa", "Asia", "Americas", "Europe", "Middle East"]}
      comingSoonLabel="Cultural Storybooks Coming Soon"
    />
  );
}

// ── Education / Digital ────────────────────────────────────────────────────

export function SELKitsPage() {
  return (
    <CategoryShellPage
      title="SEL Kits"
      subtitle="Social-Emotional Learning kits designed to build empathy, cultural awareness, and global citizenship."
      whisper="SEL"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "SEL Kits" }]}
      filterOptions={["All", "PreK–K", "Grades 1–3", "Grades 4–6", "Middle School"]}
      comingSoonLabel="SEL Kits Coming Soon"
    />
  );
}

export function ClassroomResourcesPage() {
  return (
    <CategoryShellPage
      title="Classroom Resources"
      subtitle="Ready-to-use printable resources for multicultural, globally-minded classrooms."
      whisper="Classroom"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "Classroom Resources" }]}
      filterOptions={["All", "Posters", "Worksheets", "Games", "Lesson Plans"]}
      comingSoonLabel="Classroom Resources Coming Soon"
    />
  );
}

export function ColoringPagesPage() {
  return (
    <CategoryShellPage
      title="Coloring Pages"
      subtitle="Cultural coloring pages that celebrate diversity, traditions, and global landmarks."
      whisper="Color"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "Coloring Pages" }]}
      filterOptions={["All", "Countries", "Holidays", "Animals", "Patterns"]}
      comingSoonLabel="Coloring Pages Coming Soon"
    />
  );
}

export function WorksheetsPage() {
  return (
    <CategoryShellPage
      title="Worksheets"
      subtitle="Engaging printable worksheets covering geography, culture, language, and global awareness."
      whisper="Learn"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "Worksheets" }]}
      filterOptions={["All", "Geography", "Culture", "Language", "STEM"]}
      comingSoonLabel="Worksheets Coming Soon"
    />
  );
}

// ── Collections ────────────────────────────────────────────────────────────

export function BestSellersPage() {
  return (
    <CategoryShellPage
      title="Best Sellers"
      subtitle="Our most-loved products — chosen by customers across 188 countries."
      whisper="Best Sellers"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Best Sellers" }]}
      comingSoonLabel="Best Sellers Coming Soon"
    />
  );
}

export function NewArrivalsPage() {
  return (
    <CategoryShellPage
      title="New Arrivals"
      subtitle="Fresh additions to the Wishes Without Borders Co collection — updated monthly."
      whisper="New"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "New Arrivals" }]}
      comingSoonLabel="New Arrivals Coming Soon"
    />
  );
}

export function EditorPicksPage() {
  return (
    <CategoryShellPage
      title="Editor's Picks"
      subtitle="Curated by our team — the most beautiful, meaningful, and culturally rich products in the shop."
      whisper="Curated"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Editor's Picks" }]}
      comingSoonLabel="Editor's Picks Coming Soon"
    />
  );
}

export function CulturalCollectionsPage() {
  return (
    <CategoryShellPage
      title="Cultural Collections"
      subtitle="Deep dives into the art, traditions, and celebrations of specific cultures and regions."
      whisper="Culture"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Cultural Collections" }]}
      filterOptions={["All", "Africa", "Asia", "Americas", "Europe", "Middle East", "Oceania"]}
      comingSoonLabel="Cultural Collections Coming Soon"
    />
  );
}

export function SeasonalCollectionsPage() {
  return (
    <CategoryShellPage
      title="Seasonal Collections"
      subtitle="Celebrate every season and holiday with culturally rich, globally-inspired designs."
      whisper="Seasonal"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Seasonal Collections" }]}
      filterOptions={["All", "Spring", "Summer", "Fall", "Winter", "Holidays"]}
      comingSoonLabel="Seasonal Collections Coming Soon"
    />
  );
}

export function TeacherFavoritesPage() {
  return (
    <CategoryShellPage
      title="Teacher Favorites"
      subtitle="Classroom-tested, educator-approved resources for globally-minded teachers."
      whisper="Teachers"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Teacher Favorites" }]}
      filterOptions={["All", "PreK–K", "Elementary", "Middle School", "High School"]}
      comingSoonLabel="Teacher Favorites Coming Soon"
    />
  );
}

export function KidsFavoritesPage() {
  return (
    <CategoryShellPage
      title="Kids' Favorites"
      subtitle="Products kids love — colorful, fun, and full of cultural discovery."
      whisper="Kids"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: "Kids' Favorites" }]}
      filterOptions={["All", "Ages 3–5", "Ages 6–8", "Ages 9–12"]}
      comingSoonLabel="Kids' Favorites Coming Soon"
    />
  );
}

// ── Hub pages ─────────────────────────────────────────────────────────────

export function BooksHubPage() {
  const subcategories = [
    { href: "/books/childrens", title: "Children's Books", desc: "Multicultural stories for young readers", emoji: "📚" },
    { href: "/books/early-readers", title: "Early Readers", desc: "Build reading confidence with cultural stories", emoji: "📖" },
    { href: "/books/storybooks", title: "Cultural Storybooks", desc: "Rich traditions and folklore from around the world", emoji: "🌍" },
  ];
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF" }}>
      <div style={{ background: "#0A1A2F" }} className="py-16 text-center px-6">
        <nav className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(201,168,106,0.7)" }}>
          <Link href="/" className="hover:text-[#C9A86A]">Home</Link>
          <span className="opacity-40">/</span>
          <span style={{ color: "#C9A86A" }}>Books</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Books</h1>
        <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: "#C9A86A" }} />
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>Stories that celebrate every culture, every child, every world.</p>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {subcategories.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group block rounded-xl p-8 text-center border transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}>
            <div className="text-4xl mb-3">{cat.emoji}</div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>{cat.title}</h2>
            <p className="text-sm" style={{ color: "rgba(10,26,47,0.6)" }}>{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EducationHubPage() {
  const subcategories = [
    { href: "/education/sel-kits", title: "SEL Kits", desc: "Social-Emotional Learning for global citizens", emoji: "🧠" },
    { href: "/education/classroom-resources", title: "Classroom Resources", desc: "Ready-to-use multicultural classroom tools", emoji: "🏫" },
    { href: "/education/coloring-pages", title: "Coloring Pages", desc: "Cultural coloring pages for all ages", emoji: "🎨" },
    { href: "/education/worksheets", title: "Worksheets", desc: "Geography, culture, and global awareness", emoji: "📝" },
    { href: "/flashcards", title: "Flashcards", desc: "466 cultural flashcards across 188 countries", emoji: "🗂️" },
    { href: "/activity-workbooks", title: "Activity Workbooks", desc: "Hands-on cultural learning activities", emoji: "📓" },
  ];
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF" }}>
      <div style={{ background: "#0A1A2F" }} className="py-16 text-center px-6">
        <nav className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(201,168,106,0.7)" }}>
          <Link href="/" className="hover:text-[#C9A86A]">Home</Link>
          <span className="opacity-40">/</span>
          <span style={{ color: "#C9A86A" }}>Education</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Education</h1>
        <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: "#C9A86A" }} />
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>Tools for globally-minded teachers, parents, and learners.</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group block rounded-xl p-8 text-center border transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}>
            <div className="text-4xl mb-3">{cat.emoji}</div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>{cat.title}</h2>
            <p className="text-sm" style={{ color: "rgba(10,26,47,0.6)" }}>{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CollectionsHubPage() {
  const collections = [
    { href: "/collections/best-sellers", title: "Best Sellers", desc: "Our most-loved products", emoji: "⭐" },
    { href: "/collections/new-arrivals", title: "New Arrivals", desc: "Fresh additions every month", emoji: "✨" },
    { href: "/collections/editors-picks", title: "Editor's Picks", desc: "Curated by our team", emoji: "🎯" },
    { href: "/collections/cultural", title: "Cultural Collections", desc: "Deep dives into specific cultures", emoji: "🌍" },
    { href: "/collections/seasonal", title: "Seasonal Collections", desc: "Celebrate every season", emoji: "🍂" },
    { href: "/collections/teacher-favorites", title: "Teacher Favorites", desc: "Educator-approved resources", emoji: "🏫" },
    { href: "/collections/kids-favorites", title: "Kids' Favorites", desc: "Products kids love", emoji: "🧒" },
  ];
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF" }}>
      <div style={{ background: "#0A1A2F" }} className="py-16 text-center px-6">
        <nav className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(201,168,106,0.7)" }}>
          <Link href="/" className="hover:text-[#C9A86A]">Home</Link>
          <span className="opacity-40">/</span>
          <span style={{ color: "#C9A86A" }}>Collections</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Collections</h1>
        <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: "#C9A86A" }} />
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>Curated selections for every occasion, culture, and classroom.</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Link key={col.href} href={col.href} className="group block rounded-xl p-8 text-center border transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}>
            <div className="text-4xl mb-3">{col.emoji}</div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>{col.title}</h2>
            <p className="text-sm" style={{ color: "rgba(10,26,47,0.6)" }}>{col.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
