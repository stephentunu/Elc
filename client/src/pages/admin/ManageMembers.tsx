import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

const mockMembers = [
  { id: 1, membershipId: "ELC-2024-0001", fullName: "John Kipchoge", email: "john@mmu.ac.ke", course: "Business Administration", status: "Active" },
  { id: 2, membershipId: "ELC-2024-0002", fullName: "Sarah Mwangi", email: "sarah@mmu.ac.ke", course: "Finance", status: "Active" },
  { id: 3, membershipId: "ELC-2024-0003", fullName: "David Ochieng", email: "david@mmu.ac.ke", course: "Accounting", status: "Active" },
  { id: 4, membershipId: "ELC-2024-0004", fullName: "Grace Kariuki", email: "grace@mmu.ac.ke", course: "Communications", status: "Active" },
];

export default function ManageMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();

  const filtered = mockMembers.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Manage Members</h1>
            <p className="text-sm md:text-base text-gray-600">View and manage all club members</p>
          </div>
          <Button onClick={() => setLocation("/admin/members/add")} size="sm" className="md:size-lg w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm md:text-base"
            />
          </div>
        </Card>

        <div className="overflow-x-auto">
          <Card className="overflow-hidden">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Name</th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Email</th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Course</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-2 md:py-3 font-medium text-gray-900 text-xs md:text-sm">{member.membershipId}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3 text-gray-700 text-xs md:text-sm">{member.fullName}</td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-2 md:py-3 text-gray-700 text-xs md:text-sm">{member.email}</td>
                    <td className="hidden lg:table-cell px-3 md:px-6 py-2 md:py-3 text-gray-700 text-xs md:text-sm">{member.course}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 md:px-3 py-1 rounded-full">
                        {member.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-3">
                      <div className="flex gap-1 md:gap-2">
                        <Button onClick={() => setLocation(`/admin/members/edit/${member.id}`)} variant="ghost" size="sm" className="p-1 md:p-2">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 p-1 md:p-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
