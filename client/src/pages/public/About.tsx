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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="flex gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary font-semibold">About</a>
            <a href="/members" className="text-foreground hover:text-primary">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary">Gallery</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About MMU ELC</h1>
          <p className="text-xl opacity-90">Empowering students through equity, leadership, and community service</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                The Equity Leaders' Club is dedicated to fostering an inclusive community of student leaders committed to promoting equity, social justice, and positive change.
              </p>
            </Card>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To create a campus culture where every student feels empowered to lead, where equity is lived reality, and members become agents of positive transformation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <Card key={idx} className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.course}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Equity Bank Partnership</h2>
            <p className="text-lg text-gray-700 mb-6">
              The Equity Leaders' Club is proudly supported by Equity Bank, committed to inclusive growth and community development.
            </p>
            <p className="text-gray-600">
              Equity Bank's vision of "Banking the Unbanked" aligns with our mission to create equitable opportunities for all students.
            </p>
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
