import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";

const mockGallery = [
  { id: 1, title: "Leadership Summit 2024", event: "Summit", date: "2024-02-15" },
  { id: 2, title: "Community Outreach", event: "Service", date: "2024-02-10" },
  { id: 3, title: "Member Networking", event: "Networking", date: "2024-02-05" },
  { id: 4, title: "General Meeting", event: "Meeting", date: "2024-01-30" },
];

export default function ManageGallery() {
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({ title: "", event: "", file: null as File | null });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ title: "", event: "", file: null });
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Manage Gallery</h1>
            <p className="text-gray-600">Upload and manage club photos</p>
          </div>
          <Button onClick={() => setShowUpload(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mockGallery.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 aspect-square flex items-center justify-center group relative">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary/30 mb-2">{photo.id}</div>
                  <p className="text-primary/50 font-medium">{photo.event}</p>
                </div>
                <Button
                  onClick={() => {}}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{photo.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{photo.event}</p>
                <p className="text-xs text-gray-500">{photo.date}</p>
              </div>
            </Card>
          ))}
        </div>

        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-8">
              <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Photo title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select event</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Summit">Summit</option>
                    <option value="Service">Service</option>
                    <option value="Networking">Networking</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      required
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">Upload</Button>
                  <Button onClick={() => setShowUpload(false)} variant="outline" className="flex-1">Cancel</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
