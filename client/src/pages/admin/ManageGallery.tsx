import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, Loader2, Image } from "lucide-react";

export default function ManageGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", caption: "", imageUrl: "", file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/gallery.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%7D%7D");
      const data = await res.json();
      setImages(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData({ ...formData, file });
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imageUrl = formData.imageUrl;

      // Convert file to base64 if a file was selected
      if (formData.file) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.file!);
        });
      }

      if (!imageUrl) {
        throw new Error("Please select an image or provide an image URL");
      }

      const res = await fetch("/api/trpc/gallery.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            title: formData.title,
            imageUrl,
            caption: formData.caption || undefined,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to upload image");
      }

      setFormData({ title: "", caption: "", imageUrl: "", file: null });
      setPreview(null);
      setShowUpload(false);
      await fetchImages();
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image from the gallery?")) return;
    try {
      await fetch("/api/trpc/gallery.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      await fetchImages();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setFormData({ ...formData, file });
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Gallery</h1>
            <p className="text-gray-600">Upload and manage club photos</p>
          </div>
          <Button onClick={() => setShowUpload(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />Upload Photo
          </Button>
        </div>

        {/* Stats */}
        <Card className="p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3">
            <Image className="w-8 h-8 text-primary opacity-60" />
            <div>
              <p className="text-gray-600 text-sm">Total Photos</p>
              <p className="text-2xl font-bold text-foreground">{images.length}</p>
            </div>
          </div>
        </Card>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Image className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No photos yet. Click "Upload Photo" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {images.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition group">
                <div className="relative aspect-square">
                  {photo.imageUrl ? (
                    <img src={photo.imageUrl} alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Image className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  {/* Delete button overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">
                    <Button onClick={() => handleDelete(photo.id)}
                      variant="ghost" size="sm"
                      className="opacity-0 group-hover:opacity-100 transition bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-4 h-4 mr-1" />Delete
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{photo.title}</h3>
                  {photo.caption && (
                    <p className="text-sm text-gray-600 mb-2">{photo.caption}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(photo.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo Title *</label>
                  <Input type="text" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Leadership Summit 2026" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description / Caption</label>
                  <textarea value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Brief description of the photo..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                    {preview ? (
                      <img src={preview} alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-cover" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF up to 5MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*"
                      onChange={handleFileChange} className="hidden" />
                  </div>
                  {formData.file && (
                    <p className="text-xs text-green-600 mt-2">✓ {formData.file.name} selected</p>
                  )}
                </div>

                {/* OR image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste image URL
                  </label>
                  <Input type="url" value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg" />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Upload</>}
                  </Button>
                  <Button type="button" onClick={() => {
                    setShowUpload(false);
                    setPreview(null);
                    setFormData({ title: "", caption: "", imageUrl: "", file: null });
                    setError("");
                  }} variant="outline" className="flex-1">
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