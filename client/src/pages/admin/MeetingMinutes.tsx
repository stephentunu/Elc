import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Trash2, Loader2, X } from "lucide-react";

export default function MeetingMinutes() {
  const [minutes, setMinutes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", meetingDate: "", agenda: "",
    minutesContent: "", attendees: "", decisions: "", nextMeetingDate: "",
  });

  const fetchMinutes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/minutes.list?input=%7B%22json%22%3A%7B%22limit%22%3A50%7D%7D");
      const data = await res.json();
      setMinutes(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch minutes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMinutes(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/minutes.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            title: formData.title,
            meetingDate: formData.meetingDate,
            agenda: formData.agenda || undefined,
            minutesContent: formData.minutesContent,
            attendees: formData.attendees || undefined,
            decisions: formData.decisions || undefined,
            nextMeetingDate: formData.nextMeetingDate || undefined,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to save minutes");
      }
      setFormData({ title: "", meetingDate: "", agenda: "", minutesContent: "", attendees: "", decisions: "", nextMeetingDate: "" });
      setShowModal(false);
      await fetchMinutes();
    } catch (err: any) {
      setError(err.message || "Failed to save minutes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete these meeting minutes?")) return;
    try {
      await fetch("/api/trpc/minutes.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      await fetchMinutes();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const filtered = minutes.filter(m =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Meeting Minutes</h1>
            <p className="text-gray-600">Record and manage meeting minutes</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />Record Minutes
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <Input type="text" placeholder="Search meeting minutes..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No meeting minutes yet. Click "Record Minutes" to add one.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendees</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Next Meeting</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((minute) => (
                  <tr key={minute.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{minute.meetingDate}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{minute.title}</td>
                    <td className="px-6 py-3 text-gray-700">{minute.attendees || "-"}</td>
                    <td className="px-6 py-3 text-gray-700">{minute.nextMeetingDate || "-"}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm"
                          onClick={() => setViewModal(minute)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(minute.id)}>
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

        {/* Record Minutes Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Record Meeting Minutes</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                  <Input type="text" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. General Meeting - March 2026" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date *</label>
                  <Input type="date" value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                  <Input type="text" value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    placeholder="e.g. John, Sarah, David (or number like 15)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                  <textarea value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    placeholder="Meeting agenda points..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutes Content *</label>
                  <textarea value={formData.minutesContent}
                    onChange={(e) => setFormData({ ...formData, minutesContent: e.target.value })}
                    placeholder="Full meeting minutes content..."
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Decisions</label>
                  <textarea value={formData.decisions}
                    onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                    placeholder="Key decisions made during the meeting..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Meeting Date</label>
                  <Input type="date" value={formData.nextMeetingDate}
                    onChange={(e) => setFormData({ ...formData, nextMeetingDate: e.target.value })} />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Minutes"}
                  </Button>
                  <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* View Minutes Modal */}
        {viewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-foreground">{viewModal.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setViewModal(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Meeting Date</p>
                    <p className="text-gray-900">{viewModal.meetingDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Meeting</p>
                    <p className="text-gray-900">{viewModal.nextMeetingDate || "Not set"}</p>
                  </div>
                </div>
                {viewModal.attendees && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Attendees</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{viewModal.attendees}</p>
                  </div>
                )}
                {viewModal.agenda && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Agenda</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{viewModal.agenda}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Minutes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{viewModal.minutesContent}</p>
                </div>
                {viewModal.decisions && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Key Decisions</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{viewModal.decisions}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setViewModal(null)}>Close</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}