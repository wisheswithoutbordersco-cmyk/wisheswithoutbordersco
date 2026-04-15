import { useRoute, Link } from "wouter";

// Country name → slug mapping helpers
function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Country emoji flags (subset — expand as needed)
const FLAG_MAP: Record<string, string> = {
  Afghanistan: "🇦🇫", Albania: "🇦🇱", Algeria: "🇩🇿", Angola: "🇦🇴",
  "Antigua and Barbuda": "🇦🇬", Argentina: "🇦🇷", Armenia: "🇦🇲",
  Australia: "🇦🇺", Austria: "🇦🇹", Azerbaijan: "🇦🇿",
  Bahamas: "🇧🇸", Bahrain: "🇧🇭", Bangladesh: "🇧🇩", Barbados: "🇧🇧",
  Belarus: "🇧🇾", Belgium: "🇧🇪", Belize: "🇧🇿", Benin: "🇧🇯",
  Bhutan: "🇧🇹", Bolivia: "🇧🇴", "Bosnia and Herzegovina": "🇧🇦",
  Botswana: "🇧🇼", Brazil: "🇧🇷", Brunei: "🇧🇳", Bulgaria: "🇧🇬",
  "Burkina Faso": "🇧🇫", Burundi: "🇧🇮",
  Cambodia: "🇰🇭", Cameroon: "🇨🇲", Canada: "🇨🇦", "Cape Verde": "🇨🇻",
  "Central African Republic": "🇨🇫", Chad: "🇹🇩", Chile: "🇨🇱",
  China: "🇨🇳", Colombia: "🇨🇴", Comoros: "🇰🇲", "Costa Rica": "🇨🇷",
  Croatia: "🇭🇷", Cuba: "🇨🇺", Cyprus: "🇨🇾", "Czech Republic": "🇨🇿",
  "Democratic Republic of Congo": "🇨🇩", Denmark: "🇩🇰", Djibouti: "🇩🇯",
  Dominica: "🇩🇲", "Dominican Republic": "🇩🇴", Dubai: "🇦🇪",
  Ecuador: "🇪🇨", Egypt: "🇪🇬", "El Salvador": "🇸🇻",
  "Equatorial Guinea": "🇬🇶", Eritrea: "🇪🇷", Estonia: "🇪🇪",
  Eswatini: "🇸🇿", Ethiopia: "🇪🇹",
  Fiji: "🇫🇯", Finland: "🇫🇮", France: "🇫🇷",
  Gabon: "🇬🇦", Gambia: "🇬🇲", Georgia: "🇬🇪", Germany: "🇩🇪",
  Ghana: "🇬🇭", Greece: "🇬🇷", Grenada: "🇬🇩", Guatemala: "🇬🇹",
  Guinea: "🇬🇳", "Guinea Bissau": "🇬🇼", Guyana: "🇬🇾",
  Haiti: "🇭🇹", Honduras: "🇭🇳", Hungary: "🇭🇺",
  Iceland: "🇮🇸", India: "🇮🇳", Indonesia: "🇮🇩", Iran: "🇮🇷",
  Iraq: "🇮🇶", Ireland: "🇮🇪", Italy: "🇮🇹", "Ivory Coast": "🇨🇮",
  Jamaica: "🇯🇲", Japan: "🇯🇵", Jordan: "🇯🇴",
  Kazakhstan: "🇰🇿", Kenya: "🇰🇪", Kiribati: "🇰🇮", Korea: "🇰🇷",
  Kosovo: "🇽🇰", Kuwait: "🇰🇼", Kyrgyzstan: "🇰🇬",
  Laos: "🇱🇦", Latvia: "🇱🇻", Lebanon: "🇱🇧", Lesotho: "🇱🇸",
  Liberia: "🇱🇷", Libya: "🇱🇾", Lithuania: "🇱🇹", Luxembourg: "🇱🇺",
  Madagascar: "🇲🇬", Malawi: "🇲🇼", Malaysia: "🇲🇾", Maldives: "🇲🇻",
  Mali: "🇲🇱", Malta: "🇲🇹", "Marshall Islands": "🇲🇭",
  Mauritania: "🇲🇷", Mauritius: "🇲🇺", Micronesia: "🇫🇲",
  Moldova: "🇲🇩", Mongolia: "🇲🇳", Montenegro: "🇲🇪", Morocco: "🇲🇦",
  Mozambique: "🇲🇿", Myanmar: "🇲🇲",
  Namibia: "🇳🇦", Nauru: "🇳🇷", Nepal: "🇳🇵", Netherlands: "🇳🇱",
  "New Zealand": "🇳🇿", Nicaragua: "🇳🇮", Niger: "🇳🇪", Nigeria: "🇳🇬",
  "North Korea": "🇰🇵", "North Macedonia": "🇲🇰", Norway: "🇳🇴",
  Oman: "🇴🇲",
  Pakistan: "🇵🇰", Palau: "🇵🇼", Palestine: "🇵🇸", Panama: "🇵🇦",
  "Papua New Guinea": "🇵🇬", Paraguay: "🇵🇾", Peru: "🇵🇪",
  Philippines: "🇵🇭", Poland: "🇵🇱", Portugal: "🇵🇹", "Puerto Rico": "🇵🇷",
  Qatar: "🇶🇦",
  "Republic of Congo": "🇨🇬", Romania: "🇷🇴", Russia: "🇷🇺", Rwanda: "🇷🇼",
  "Saint Kitts and Nevis": "🇰🇳", "Saint Lucia": "🇱🇨",
  "Saint Vincent and the Grenadines": "🇻🇨", Samoa: "🇼🇸",
  "Sao Tome and Principe": "🇸🇹", "Saudi Arabia": "🇸🇦", Senegal: "🇸🇳",
  Serbia: "🇷🇸", Seychelles: "🇸🇨", "Sierra Leone": "🇸🇱",
  Singapore: "🇸🇬", Slovakia: "🇸🇰", Slovenia: "🇸🇮",
  "Solomon Islands": "🇸🇧", Somalia: "🇸🇴", "South Africa": "🇿🇦",
  "South Sudan": "🇸🇸", Spain: "🇪🇸", "Sri Lanka": "🇱🇰", Sudan: "🇸🇩",
  Suriname: "🇸🇷", Sweden: "🇸🇪", Switzerland: "🇨🇭", Syria: "🇸🇾",
  Taiwan: "🇹🇼", Tajikistan: "🇹🇯", Tanzania: "🇹🇿", Thailand: "🇹🇭",
  "Timor Leste": "🇹🇱", Togo: "🇹🇬", Tonga: "🇹🇴",
  "Trinidad Tobago": "🇹🇹", Tunisia: "🇹🇳", Turkey: "🇹🇷",
  Turkmenistan: "🇹🇲", Tuvalu: "🇹🇻",
  Uganda: "🇺🇬", Ukraine: "🇺🇦", "United Kingdom": "🇬🇧",
  Uruguay: "🇺🇾", Uzbekistan: "🇺🇿",
  Vanuatu: "🇻🇺", Venezuela: "🇻🇪", Vietnam: "🇻🇳",
  Yemen: "🇾🇪",
  Zambia: "🇿🇲", Zimbabwe: "🇿🇼",
};

const CARD_TYPES = [
  "Birthday", "Anniversary", "Graduation", "Congratulations",
  "Thank You", "Thinking of You", "Get Well Soon", "Sympathy",
  "Mother's Day", "Father's Day", "New Year", "In Loving Memory", "Baby Shower",
];

export default function CountryPage() {
  const [, params] = useRoute("/country/:slug");
  const slug = params?.slug ?? "";
  const countryName = slugToName(slug);
  const flag = FLAG_MAP[countryName] ?? "🌍";

  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "#0A1A2F" }}>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="text-[12vw] font-bold uppercase tracking-widest opacity-5"
            style={{ fontFamily: "'Playfair Display', serif", color: "#C9A86A" }}
          >
            {countryName}
          </span>
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(201,168,106,0.7)" }}>
            <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <Link href="/birthday" className="hover:text-[#C9A86A] transition-colors">Greeting Cards</Link>
            <span className="opacity-40">/</span>
            <span style={{ color: "#C9A86A" }}>{countryName}</span>
          </nav>
          <div className="text-6xl mb-4" aria-label={`${countryName} flag`}>{flag}</div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "#fff", fontFamily: "'Playfair Display', serif" }}
          >
            {countryName} Cards
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-4" style={{ background: "#C9A86A" }} />
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Multicultural greeting cards celebrating the culture, traditions, and spirit of {countryName}.
          </p>
        </div>
      </div>

      {/* Card Type Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
        >
          Shop {countryName} Cards by Occasion
        </h2>
        <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: "#C9A86A" }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CARD_TYPES.map((type) => {
            const href = `/${type.toLowerCase().replace(/['']/g, "").replace(/\s+/g, "-")}?country=${encodeURIComponent(countryName)}`;
            return (
              <Link
                key={type}
                href={href}
                className="group block rounded-xl p-5 text-center border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: "#fff", borderColor: "rgba(201,168,106,0.2)" }}
              >
                <p className="font-semibold text-sm" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
                  {type}
                </p>
                <p className="text-xs mt-1" style={{ color: "#C9A86A" }}>Shop →</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* About Country placeholder */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl border-2 border-dashed p-10 text-center"
          style={{ borderColor: "rgba(201,168,106,0.3)", background: "rgba(201,168,106,0.04)" }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}>
            About {countryName}
          </h3>
          <div className="w-10 h-0.5 mx-auto mb-3" style={{ background: "#C9A86A" }} />
          <p className="text-sm" style={{ color: "rgba(10,26,47,0.5)" }}>
            Cultural description and context for {countryName} coming soon. We celebrate the rich traditions, languages, and heritage of every country we serve.
          </p>
        </div>
      </div>

      {/* SEO placeholder */}

    </div>
  );
}
