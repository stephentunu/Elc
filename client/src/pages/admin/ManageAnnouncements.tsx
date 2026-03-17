import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", category: "General", priority: "Normal", content: ""
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/announcements.list?input=%7B%22json%22%3A%7B%22limit%22%3A50%2C%22offset%22%3A0%7D%7D");
      const data = await res.json();
      setAnnouncements(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/announcements.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            priority: formData.priority,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.message || "Failed to create announcement");
      }
      setFormData({ title: "", category: "General", priority: "Normal", content: "" });
      setShowModal(false);
      await fetchAnnouncements();
    } catch (err: any) {
      setError(err.message || "Failed to create announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await fetch("/api/trpc/announcements.update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { id, isPublished: false } }),
      });
      await fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filtered = announcements.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Announcements</h1>
            <p className="text-gray-600">Create and manage club announcements</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No announcements yet. Click "New Announcement" to create one.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{a.title}</td>
                    <td className="px-6 py-3 text-gray-700">{a.category}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        a.priority === "Urgent" ? "bg-red-100 text-red-800" :
                        a.priority === "High" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(a.id)}>
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

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">New Announcement</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General">General</option>
                    <option value="Finance">Finance</option>
                    <option value="Events">Events</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Announcement content"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Create"}
                  </Button>
                  <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}