import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function ManageEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", time: "", venue: "", category: "Meeting",
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/events.list?input=%7B%22json%22%3A%7B%22upcoming%22%3Atrue%7D%7D");
      const data = await res.json();
      setEvents(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/events.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            title: formData.title,
            description: formData.description || undefined,
            eventDate: formData.date,
            eventTime: formData.time || undefined,
            venue: formData.venue || undefined,
            category: formData.category,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to create event");
      }
      setFormData({ title: "", description: "", date: "", time: "", venue: "", category: "Meeting" });
      setShowModal(false);
      await fetchEvents();
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch("/api/trpc/events.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to delete event");
      }
      await fetchEvents();
    } catch (err: any) {
      alert("Failed to delete event: " + err.message);
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Events</h1>
            <p className="text-gray-600">Create and manage club events</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />New Event
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <Input type="text" placeholder="Search events..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No events yet. Click "New Event" to create one.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-3 text-gray-700">{event.eventDate}</td>
                    <td className="px-6 py-3 text-gray-700">{event.eventTime || "-"}</td>
                    <td className="px-6 py-3 text-gray-700">{event.venue || "-"}</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
              <h2 className="text-2xl font-bold mb-6">New Event</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input type="text" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description" rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input type="date" value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <Input type="time" value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <Input type="text" value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Event venue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Meeting">Meeting</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Social">Social</option>
                    <option value="Training">Training</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : "Create"}
                  </Button>
                  <Button type="button" onClick={() => setShowModal(false)}
                    variant="outline" className="flex-1">
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