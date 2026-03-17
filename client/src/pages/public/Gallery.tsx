import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/trpc/gallery.list?input=%7B%22json%22%3A%7B%22limit%22%3A50%7D%7D")
      .then(r => r.json())
      .then(d => setImages(d?.result?.data?.json || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No gallery images yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  onClick={() => setSelected(photo)}>
                  {photo.imageUrl ? (
                    <img src={photo.imageUrl} alt={photo.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 aspect-square flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">{photo.title?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{photo.title}</h3>
                    {photo.caption && <p className="text-sm text-gray-600 mt-1">{photo.caption}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <X className="w-8 h-8" />
            </button>
            {selected.imageUrl ? (
              <img src={selected.imageUrl} alt={selected.title} className="w-full rounded-lg" />
            ) : (
              <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                <span className="text-white text-2xl">{selected.title}</span>
              </div>
            )}
            <div className="bg-white rounded-b-lg p-4">
              <h3 className="font-semibold text-lg">{selected.title}</h3>
              {selected.caption && <p className="text-gray-600 text-sm mt-1">{selected.caption}</p>}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}