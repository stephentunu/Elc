import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Trash2 } from "lucide-react";

export default function Contributions() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    memberId: "", amount: "500", paymentType: "Subscription",
    month: "", year: new Date().getFullYear().toString(), mpesaCode: "", notes: "",
  });

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trpc/contributions.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D");
      const data = await res.json();
      setContributions(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/trpc/members.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D");
      const data = await res.json();
      setMembers(data?.result?.data?.json || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  useEffect(() => {
    fetchContributions();
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/contributions.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            memberId: parseInt(formData.memberId),
            amount: parseFloat(formData.amount),
            paymentType: formData.paymentType,
            month: formData.month,
            year: parseInt(formData.year),
            mpesaCode: formData.mpesaCode || undefined,
            notes: formData.notes || undefined,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to record contribution");
      }
      setFormData({ memberId: "", amount: "500", paymentType: "Subscription", month: "", year: new Date().getFullYear().toString(), mpesaCode: "", notes: "" });
      setShowModal(false);
      await fetchContributions();
    } catch (err: any) {
      setError(err.message || "Failed to record contribution");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contribution record?")) return;
    try {
      await fetch("/api/trpc/contributions.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      await fetchContributions();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const totalCollected = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const filtered = contributions.filter(c =>
    c.memberId?.toString().includes(searchTerm) ||
    c.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Contributions</h1>
            <p className="text-gray-600">Track member subscription payments</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />Record Contribution
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Collected</p>
            <p className="text-2xl md:text-3xl font-bold text-primary">KES {totalCollected.toLocaleString()}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Payments</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{contributions.length}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Members</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{members.length}</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search by member ID or month..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No contributions yet. Click "Record Contribution" to add one.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">M-Pesa Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{c.memberId}</td>
                    <td className="px-6 py-3 text-gray-700">KES {parseFloat(c.amount).toLocaleString()}</td>
                    <td className="px-6 py-3 text-gray-700">{c.paymentType}</td>
                    <td className="px-6 py-3 text-gray-700">{c.month}</td>
                    <td className="px-6 py-3 text-gray-700">{c.year}</td>
                    <td className="px-6 py-3 text-gray-700">{c.mpesaCode || "-"}</td>
                    <td className="px-6 py-3">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Button variant="ghost" size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(c.id)}>
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
              <h2 className="text-2xl font-bold mb-6">Record Contribution</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member *</label>
                  <select value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required>
                    <option value="">Select a member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.fullName} ({m.membershipId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                  <Input type="number" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <select value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Subscription">Subscription</option>
                    <option value="Event">Event</option>
                    <option value="Donation">Donation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <select value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required>
                    <option value="">Select month</option>
                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <Input type="number" value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Code</label>
                  <Input type="text" value={formData.mpesaCode}
                    onChange={(e) => setFormData({ ...formData, mpesaCode: e.target.value })}
                    placeholder="MPX123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes" rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save"}
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