import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

const mockEvents = [
  { id: 1, title: "General Meeting", date: "2024-03-01", time: "3:00 PM", venue: "Main Hall", category: "Meeting", description: "Monthly general meeting for all members" },
  { id: 2, title: "Leadership Summit", date: "2024-03-15", time: "9:00 AM", venue: "Conference Center", category: "Conference", description: "Annual leadership development summit" },
  { id: 3, title: "Community Outreach", date: "2024-03-20", time: "10:00 AM", venue: "Downtown Community Center", category: "Service", description: "Community service initiative" },
  { id: 4, title: "Networking Breakfast", date: "2024-03-25", time: "7:30 AM", venue: "Equity Bank HQ", category: "Networking", description: "Meet with industry leaders and mentors" },
  { id: 5, title: "Member Appreciation Gala", date: "2024-04-05", time: "6:00 PM", venue: "Grand Hotel Ballroom", category: "Social", description: "Celebrate our members' achievements" },
];

export default function Events() {
  const [showUpcoming, setShowUpcoming] = useState(true);

  const filtered = mockEvents.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    return showUpcoming ? eventDate >= today : eventDate < today;
  });

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="flex gap-4 md:gap-6">
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
            <button
              onClick={() => setShowUpcoming(true)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                showUpcoming
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setShowUpcoming(false)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                !showUpcoming
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Past Events
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filtered.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground flex-1">{event.title}</h3>
                  <Badge className="bg-primary/10 text-primary">{event.category}</Badge>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No {showUpcoming ? "upcoming" : "past"} events found.</p>
            </div>
          )}
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
