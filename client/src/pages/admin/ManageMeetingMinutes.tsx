import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Trash2 } from "lucide-react";

const mockMinutes = [
  { id: 1, date: "2024-02-20", title: "General Meeting - February 2024", attendees: 12, decisions: 3 },
  { id: 2, date: "2024-01-16", title: "General Meeting - January 2024", attendees: 15, decisions: 5 },
  { id: 3, date: "2023-12-19", title: "General Meeting - December 2023", attendees: 10, decisions: 2 },
];

export default function ManageMeetingMinutes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    attendees: "",
    agenda: "",
    decisions: "",
    nextMeeting: "",
  });

  const filtered = mockMinutes.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ date: "", title: "", attendees: "", agenda: "", decisions: "", nextMeeting: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meeting Minutes</h1>
            <p className="text-gray-600">Record and manage meeting minutes</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Record Minutes
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <Input
            type="text"
            placeholder="Search meeting minutes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendees</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Decisions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((minute) => (
                <tr key={minute.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{minute.date}</td>
                  <td className="px-6 py-3 text-gray-700">{minute.title}</td>
                  <td className="px-6 py-3 text-gray-700">{minute.attendees}</td>
                  <td className="px-6 py-3 text-gray-700">{minute.decisions}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <Card className="w-full max-w-md p-8 my-8">
              <h2 className="text-2xl font-bold mb-6">Record Meeting Minutes</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., General Meeting - February 2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Attendees</label>
                  <Input
                    type="number"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    placeholder="15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                  <textarea
                    value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    placeholder="Meeting agenda points"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Decisions</label>
                  <textarea
                    value={formData.decisions}
                    onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                    placeholder="Decisions made during the meeting"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Meeting Date</label>
                  <Input
                    type="date"
                    value={formData.nextMeeting}
                    onChange={(e) => setFormData({ ...formData, nextMeeting: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">Save Minutes</Button>
                  <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">Cancel</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
