import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);

  useEffect(() => {
    fetch("/api/trpc/events.list?input=%7B%22json%22%3A%7B%22upcoming%22%3Atrue%7D%7D")
      .then(r => r.json())
      .then(d => setEvents(d?.result?.data?.json || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const filtered = events.filter(e =>
    showUpcoming ? e.eventDate >= today : e.eventDate < today
  );

  const categoryColors: Record<string, string> = {
    Meeting: "bg-blue-100 text-blue-800",
    Workshop: "bg-purple-100 text-purple-800",
    Social: "bg-pink-100 text-pink-800",
    Training: "bg-yellow-100 text-yellow-800",
    "Community Service": "bg-green-100 text-green-800",
    Conference: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="hidden md:flex gap-4 md:gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary">About</a>
            <a href="/members" className="text-foreground hover:text-primary">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary font-semibold">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary">Gallery</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-xl opacity-90">Join us for upcoming club events and activities</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex gap-4">
            <button onClick={() => setShowUpcoming(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${showUpcoming ? "bg-primary text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
              Upcoming Events
            </button>
            <button onClick={() => setShowUpcoming(false)}
              className={`px-6 py-2 rounded-lg font-medium transition ${!showUpcoming ? "bg-primary text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
              Past Events
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No {showUpcoming ? "upcoming" : "past"} events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filtered.map((event) => (
                <Card key={event.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground flex-1">{event.title}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ml-2 ${categoryColors[event.category] || "bg-gray-100 text-gray-800"}`}>
                      {event.category}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(event.eventDate).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    {event.eventTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.eventTime}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
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