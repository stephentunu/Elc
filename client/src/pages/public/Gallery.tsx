import React from "react";
import { Card } from "@/components/ui/card";

const mockGallery = [
  { id: 1, title: "Leadership Summit 2024", event: "Summit" },
  { id: 2, title: "Community Outreach", event: "Service" },
  { id: 3, title: "Member Networking", event: "Networking" },
  { id: 4, title: "General Meeting", event: "Meeting" },
  { id: 5, title: "Team Building Activity", event: "Social" },
  { id: 6, title: "Award Ceremony", event: "Recognition" },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="flex gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary">About</a>
            <a href="/members" className="text-foreground hover:text-primary">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary font-semibold">Gallery</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl opacity-90">Moments from our club activities and events</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGallery.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer group">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 aspect-square flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary/30 mb-2">{photo.id}</div>
                    <p className="text-primary/50 font-medium">{photo.event}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{photo.title}</h3>
                  <p className="text-sm text-gray-600">{photo.event}</p>
                </div>
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
