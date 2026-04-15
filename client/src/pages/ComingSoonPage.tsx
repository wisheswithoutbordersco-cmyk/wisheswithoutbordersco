import { Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { Globe, ArrowLeft } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EF" }}>
      <NavBar />
      <div className="flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(201,168,106,0.12)" }}
        >
          <Globe className="w-10 h-10" style={{ color: "#C9A86A" }} />
        </div>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "#C9A86A", fontFamily: "'DM Sans', sans-serif" }}
        >
          Coming Soon
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#0A1A2F", fontFamily: "'Playfair Display', serif" }}
        >
          Something Special is Brewing
        </h1>
        <p
          className="text-base max-w-md mb-10"
          style={{ color: "rgba(10,26,47,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
        >
          We're working on something exciting for this section. Stay tuned — new products and features are added every month.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-bold rounded-full transition-colors text-sm"
            style={{ background: "#C9A86A", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/birthday"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-full transition-colors text-sm"
            style={{ border: "1px solid rgba(10,26,47,0.18)", color: "#0A1A2F", fontFamily: "'DM Sans', sans-serif" }}
          >
            Browse Cards
          </Link>
        </div>
      </div>
    </div>
  );
}
