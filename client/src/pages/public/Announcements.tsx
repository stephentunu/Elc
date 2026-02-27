import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Zap } from "lucide-react";

const mockAnnouncements = [
  { id: 1, title: "General Meeting Next Friday", content: "All members are invited to our general meeting next Friday at 3 PM in the main hall.", category: "General", priority: "Normal", date: "2024-02-27" },
  { id: 2, title: "February Contributions Due", content: "Please ensure your February contributions are submitted by end of month. M-Pesa codes required.", category: "Finance", priority: "High", date: "2024-02-26" },
  { id: 3, title: "Leadership Summit Announcement", content: "We are hosting a leadership summit on March 15th. Registration is now open!", category: "Events", priority: "Normal", date: "2024-02-25" },
  { id: 4, title: "Urgent: Venue Change for Event", content: "The venue for tomorrow's event has been changed to the conference center. Please share with all attendees.", category: "Urgent", priority: "Urgent", date: "2024-02-24" },
  { id: 5, title: "New Mentorship Program Launch", content: "We are excited to launch our new mentorship program connecting senior and junior members.", category: "General", priority: "Normal", date: "2024-02-23" },
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = selectedCategory
    ? mockAnnouncements.filter(a => a.category === selectedCategory)
    : mockAnnouncements;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="flex gap-4 md:gap-6">
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
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === null
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {["General", "Finance", "Events", "Urgent"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((announcement) => (
              <Card key={announcement.id} className="p-6 hover:shadow-lg transition border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{announcement.title}</h3>
                    <p className="text-gray-600">{announcement.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={categoryColors[announcement.category]}>
                      {announcement.category}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      {priorityIcons[announcement.priority]}
                      {announcement.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
