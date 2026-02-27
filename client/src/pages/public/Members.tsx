import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Mail, Phone } from "lucide-react";

const mockMembers = [
  { id: 1, membershipId: "ELC-2024-0001", fullName: "John Kipchoge", course: "Business Administration", yearOfStudy: 3, role: "Chairperson", status: "Active" },
  { id: 2, membershipId: "ELC-2024-0002", fullName: "Sarah Mwangi", course: "Finance", yearOfStudy: 2, role: "Vice Chairperson", status: "Active" },
  { id: 3, membershipId: "ELC-2024-0003", fullName: "David Ochieng", course: "Accounting", yearOfStudy: 3, role: "Treasurer", status: "Active" },
  { id: 4, membershipId: "ELC-2024-0004", fullName: "Grace Kariuki", course: "Communications", yearOfStudy: 2, role: "Secretary", status: "Active" },
  { id: 5, membershipId: "ELC-2024-0005", fullName: "Michael Kiplagat", course: "Marketing", yearOfStudy: 1, role: "Member", status: "Active" },
  { id: 6, membershipId: "ELC-2024-0006", fullName: "Amara Hassan", course: "Business Management", yearOfStudy: 3, role: "Member", status: "Active" },
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockMembers.filter(m =>
      m.fullName.toLowerCase().includes(value.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(value.toLowerCase()) ||
      m.course.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="flex gap-4 md:gap-6">
            <a href="/" className="text-foreground hover:text-primary">Home</a>
            <a href="/about" className="text-foreground hover:text-primary">About</a>
            <a href="/members" className="text-foreground hover:text-primary font-semibold">Members</a>
            <a href="/announcements" className="text-foreground hover:text-primary">Announcements</a>
            <a href="/events" className="text-foreground hover:text-primary">Events</a>
            <a href="/gallery" className="text-foreground hover:text-primary">Gallery</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Members</h1>
          <p className="text-xl opacity-90">Meet the talented leaders shaping our community</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, membership ID, or course..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{member.fullName.charAt(0)}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {member.status}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{member.fullName}</h3>
                <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>ID:</strong> {member.membershipId}</p>
                  <p><strong>Course:</strong> {member.course}</p>
                  <p><strong>Year:</strong> Year {member.yearOfStudy}</p>
                </div>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No members found matching your search.</p>
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
