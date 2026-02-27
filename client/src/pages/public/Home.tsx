import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Users, TrendingUp, Calendar, FileText } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold text-primary">MMU ELC</div>
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            <a href="/" className="text-sm lg:text-base text-foreground hover:text-primary transition">Home</a>
            <a href="/about" className="text-sm lg:text-base text-foreground hover:text-primary transition">About</a>
            <a href="/members" className="text-sm lg:text-base text-foreground hover:text-primary transition">Members</a>
            <a href="/announcements" className="text-sm lg:text-base text-foreground hover:text-primary transition">Announcements</a>
            <a href="/events" className="text-sm lg:text-base text-foreground hover:text-primary transition">Events</a>
            <a href="/gallery" className="text-sm lg:text-base text-foreground hover:text-primary transition">Gallery</a>
            <Button onClick={() => setLocation("/admin/login")} variant="default" size="sm">
              Admin
            </Button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button onClick={() => setLocation("/admin/login")} variant="default" size="sm">
              Admin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">Equity Leaders' Club</h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90 px-2">Empowering MMU students through leadership, equity, and community service</p>
          <Button onClick={() => setLocation("/members")} variant="secondary" size="lg">
            Explore Members <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 text-center hover:shadow-lg transition">
              <Users className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Member Directory</h3>
              <p className="text-sm md:text-base text-gray-600">Connect with club members and explore their profiles</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 text-center hover:shadow-lg transition">
              <Calendar className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Events</h3>
              <p className="text-sm md:text-base text-gray-600">Stay updated on upcoming club events and activities</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 text-center hover:shadow-lg transition">
              <FileText className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Announcements</h3>
              <p className="text-sm md:text-base text-gray-600">Get the latest news and updates from leadership</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 text-center hover:shadow-lg transition">
              <TrendingUp className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Growth</h3>
              <p className="text-sm md:text-base text-gray-600">Develop leadership skills and make an impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Join the Movement</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">Be part of a community dedicated to equity and leadership</p>
          <Button onClick={() => setLocation("/contact")} size="lg">
            Get in Touch
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm md:text-base">&copy; 2024 Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
