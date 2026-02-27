import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Users, TrendingUp, Calendar, FileText } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">MMU ELC</div>
          <div className="flex gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary">About</a>
            <a href="/members" className="text-foreground hover:text-primary">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary">Gallery</a>
            <Button onClick={() => setLocation("/admin/login")} variant="default" size="sm">
              Admin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Equity Leaders' Club</h1>
          <p className="text-xl mb-8 opacity-90">Empowering MMU students through leadership, equity, and community service</p>
          <Button onClick={() => setLocation("/members")} variant="secondary" size="lg">
            Explore Members <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Member Directory</h3>
              <p className="text-gray-600">Connect with club members and explore their profiles</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Events</h3>
              <p className="text-gray-600">Stay updated on upcoming club events and activities</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Announcements</h3>
              <p className="text-gray-600">Get the latest news and updates from leadership</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <p className="text-gray-600">Develop leadership skills and make an impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg text-gray-600 mb-8">Be part of a community dedicated to equity and leadership</p>
          <Button onClick={() => setLocation("/contact")} size="lg">
            Get in Touch
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
