import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function AddMember() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", studentId: "",
    course: "", yearOfStudy: "1", role: "Member",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/trpc/members.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || undefined,
            studentId: formData.studentId || undefined,
            course: formData.course,
            yearOfStudy: parseInt(formData.yearOfStudy),
            role: formData.role,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to add member");
      }
      const membershipId = data?.result?.data?.json?.membershipId;
      setSuccess(`Member added successfully! Membership ID: ${membershipId}`);
      setFormData({ fullName: "", email: "", phone: "", studentId: "", course: "", yearOfStudy: "1", role: "Member" });
      setTimeout(() => setLocation("/admin/members"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Button onClick={() => setLocation("/admin/members")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Button>
        <Card className="p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Add New Member</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-green-800 text-sm">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <Input type="text" value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Kipchoge" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@mmu.ac.ke" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input type="tel" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0712345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <Input type="text" value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="MMU/2024/001" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <Input type="text" value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="Business Administration" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                <select value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Member">Member</option>
                <option value="Chairperson">Chairperson</option>
                <option value="Vice Chairperson">Vice Chairperson</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="PR Officer">PR Officer</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Add Member</>}
              </Button>
              <Button type="button" onClick={() => setLocation("/admin/members")} variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}