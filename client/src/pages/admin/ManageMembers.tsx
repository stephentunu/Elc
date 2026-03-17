import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ManageMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/members.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D");
      const data = await res.json();
      setMembers(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate this member?")) return;
    try {
      await fetch("/api/trpc/members.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      await fetchMembers();
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  const filtered = members.filter(m =>
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Manage Members</h1>
            <p className="text-sm md:text-base text-gray-600">View and manage all club members</p>
          </div>
          <Button onClick={() => setLocation("/admin/members/add")} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />Add Member
          </Button>
        </div>

        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search by name, ID or email..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10" />
          </div>
        </Card>

        <div className="overflow-x-auto">
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-12 text-gray-500">
                {searchTerm ? "No members match your search." : "No members yet. Click 'Add Member' to get started."}
              </div>
            ) : (
              <table className="w-full text-sm md:text-base">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Membership ID</th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Name</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-2 md:py-3 font-medium text-primary text-xs md:text-sm">{member.membershipId}</td>
                      <td className="px-3 md:px-6 py-2 md:py-3 font-medium text-gray-900 text-xs md:text-sm">{member.fullName}</td>
                      <td className="hidden md:table-cell px-6 py-3 text-gray-700 text-sm">{member.email}</td>
                      <td className="hidden lg:table-cell px-6 py-3 text-gray-700 text-sm">{member.course || "-"}</td>
                      <td className="hidden lg:table-cell px-6 py-3 text-gray-700 text-sm">{member.role || "Member"}</td>
                      <td className="px-3 md:px-6 py-2 md:py-3">
                        <span className={`text-xs font-semibold px-2 md:px-3 py-1 rounded-full ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-2 md:py-3">
                        <div className="flex gap-1 md:gap-2">
                          <Button onClick={() => setLocation(`/admin/members/edit/${member.id}`)}
                            variant="ghost" size="sm" className="p-1 md:p-2">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(member.id)}
                            variant="ghost" size="sm" className="text-red-600 hover:text-red-700 p-1 md:p-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-right">
          Total: {filtered.length} member{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}