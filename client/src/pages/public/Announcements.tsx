import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Info, Zap, Loader2 } from "lucide-react";

const categoryColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Events: "bg-purple-100 text-purple-800",
  Urgent: "bg-red-100 text-red-800",
};

const priorityIcons: Record<string, React.ReactNode> = {
  Normal: <Info className="w-4 h-4" />,
  High: <AlertCircle className="w-4 h-4" />,
  Urgent: <Zap className="w-4 h-4" />,
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trpc/announcements.list?input=%7B%22json%22%3A%7B%22limit%22%3A50%2C%22offset%22%3A0%7D%7D")
      .then(r => r.json())
      .then(d => setAnnouncements(d?.result?.data?.json || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedCategory
    ? announcements.filter(a => a.category === selectedCategory)
    : announcements;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="hidden md:flex gap-4 md:gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary">About</a>
            <a href="/members" className="text-foreground hover:text-primary">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary font-semibold">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary">Gallery</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Announcements</h1>
          <p className="text-xl opacity-90">Stay updated with the latest club news and updates</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex gap-2 flex-wrap">
            {[null, "General", "Finance", "Events", "Urgent"].map((cat) => (
              <button key={cat ?? "all"} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === cat ? "bg-primary text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}>
                {cat ?? "All"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No announcements found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((a) => (
                <Card key={a.id} className="p-6 hover:shadow-lg transition border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{a.title}</h3>
                      <p className="text-gray-600">{a.content}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[a.category] || "bg-gray-100 text-gray-800"}`}>
                        {a.category}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        {priorityIcons[a.priority]}
                        {a.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}