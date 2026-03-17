import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trpc/members.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D")
      .then(r => r.json())
      .then(d => setMembers(d?.result?.data?.json || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(m =>
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.course?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(m => m.status === "Active");

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">MMU ELC</a>
          <div className="hidden md:flex gap-4 md:gap-6">
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
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Search by name, membership ID, or course..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((member) => (
                <Card key={member.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {member.fullName?.charAt(0)}
                      </span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {member.status}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{member.fullName}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role || "Member"}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>ID:</strong> {member.membershipId}</p>
                    <p><strong>Course:</strong> {member.course || "-"}</p>
                    <p><strong>Year:</strong> {member.yearOfStudy ? `Year ${member.yearOfStudy}` : "-"}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filtered.length} active member{filtered.length !== 1 ? "s" : ""}
          </div>
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