import { NavBar } from "@/components/NavBar";
import { BookOpen, Clock } from "lucide-react";

export default function ChildrensBooksPage() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <NavBar />
      <div className="bg-[#1a2744] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-[#d4af37]" />
          <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest">Children's Books</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Children's Books</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Illustrated children's books celebrating cultures from around the world.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-md p-12 max-w-md w-full border border-[#d4af37]/20">
          <Clock className="w-14 h-14 text-[#d4af37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-serif text-[#1a2744] mb-3">New</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Our Children's Books collection features "A Day in the Life of..." series — illustrated stories celebrating cultures from around the world. Perfect for curious young readers.
          </p>
          <p className="text-[#d4af37] font-semibold mt-5 text-sm">Browse the collection at Global Vibes!</p>
        </div>
      </div>
    </div>
  );
}
