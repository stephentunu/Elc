import React from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb, Users, Award, Heart, Zap, Target } from "lucide-react";

const values = [
  { icon: Lightbulb, title: "Transparency", description: "Open and honest communication" },
  { icon: Users, title: "Leadership", description: "Developing inspiring leaders" },
  { icon: Award, title: "Excellence", description: "Highest standards in everything" },
  { icon: Heart, title: "Unity", description: "Fostering community belonging" },
  { icon: Zap, title: "Innovation", description: "Embracing creative solutions" },
  { icon: Target, title: "Impact", description: "Making meaningful difference" },
];

const leadership = [
  { name: "John Kipchoge", role: "Chairperson", course: "Business Administration" },
  { name: "Sarah Mwangi", role: "Vice Chairperson", course: "Finance" },
  { name: "David Ochieng", role: "Treasurer", course: "Accounting" },
  { name: "Grace Kariuki", role: "Secretary", course: "Communications" },
  { name: "Michael Kiplagat", role: "PR Officer", course: "Marketing" },
  { name: "Amara Hassan", role: "Events Coordinator", course: "Business Management" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <a href="/" className="text-xl md:text-2xl font-bold text-primary">MMU ELC</a>
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            <a href="/" className="text-sm lg:text-base text-foreground hover:text-primary transition">Home</a>
            <a href="/about" className="text-sm lg:text-base text-foreground hover:text-primary font-semibold transition">About</a>
            <a href="/members" className="text-sm lg:text-base text-foreground hover:text-primary transition">Members</a>
            <a href="/announcements" className="text-sm lg:text-base text-foreground hover:text-primary transition">Announcements</a>
            <a href="/events" className="text-sm lg:text-base text-foreground hover:text-primary transition">Events</a>
            <a href="/gallery" className="text-sm lg:text-base text-foreground hover:text-primary transition">Gallery</a>
          </div>
          <div className="md:hidden">
            <a href="/" className="text-sm text-primary">Menu</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">About MMU ELC</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 px-2">Empowering students through equity, leadership, and community service</p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <Card className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">Our Mission</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                The Equity Leaders' Club is dedicated to fostering an inclusive community of student leaders committed to promoting equity, social justice, and positive change.
              </p>
            </Card>
            <Card className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">Our Vision</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                To create a campus culture where every student feels empowered to lead, where equity is lived reality, and members become agents of positive transformation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="p-4 md:p-6 text-center hover:shadow-lg transition">
                  <Icon className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {leadership.map((member, idx) => (
              <Card key={idx} className="p-4 md:p-6 text-center">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm md:text-base text-primary font-medium">{member.role}</p>
                <p className="text-xs md:text-sm text-gray-600">{member.course}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Equity Bank Partnership</h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 mb-4 md:mb-6 px-2">
              The Equity Leaders' Club is proudly supported by Equity Bank, committed to inclusive growth and community development.
            </p>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Equity Bank's vision of "Banking the Unbanked" aligns with our mission to create equitable opportunities for all students.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm md:text-base">&copy; 2024 Multimedia University Equity Leaders' Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
