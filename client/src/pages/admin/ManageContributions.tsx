import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";

const mockContributions = [
  { id: 1, memberName: "John Kipchoge", membershipId: "ELC-2024-0001", month: "February 2024", amount: 1000, mPesaCode: "MPX123456", status: "Paid" },
  { id: 2, memberName: "Sarah Mwangi", membershipId: "ELC-2024-0002", month: "February 2024", amount: 1000, mPesaCode: "MPX123457", status: "Paid" },
  { id: 3, memberName: "David Ochieng", membershipId: "ELC-2024-0003", month: "February 2024", amount: 1000, mPesaCode: "", status: "Unpaid" },
  { id: 4, memberName: "Grace Kariuki", membershipId: "ELC-2024-0004", month: "February 2024", amount: 1000, mPesaCode: "MPX123458", status: "Paid" },
  { id: 5, memberName: "Michael Kiplagat", membershipId: "ELC-2024-0005", month: "January 2024", amount: 1000, mPesaCode: "", status: "Unpaid" },
];

export default function ManageContributions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ membershipId: "", month: "", amount: "", mPesaCode: "" });

  const filtered = mockContributions.filter(c =>
    c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unpaidCount = mockContributions.filter(c => c.status === "Unpaid").length;
  const totalAmount = mockContributions.filter(c => c.status === "Paid").reduce((sum, c) => sum + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ membershipId: "", month: "", amount: "", mPesaCode: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Contributions</h1>
            <p className="text-gray-600">Track member subscription payments</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Record Contribution
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Collected</p>
            <p className="text-3xl font-bold text-primary">KES {totalAmount.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Unpaid Members</p>
            <p className="text-3xl font-bold text-red-600">{unpaidCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Members</p>
            <p className="text-3xl font-bold text-blue-600">{mockContributions.length}</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by member name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Membership ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">M-Pesa Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contrib) => (
                <tr key={contrib.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{contrib.memberName}</td>
                  <td className="px-6 py-3 text-gray-700">{contrib.membershipId}</td>
                  <td className="px-6 py-3 text-gray-700">{contrib.month}</td>
                  <td className="px-6 py-3 text-gray-700">KES {contrib.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-700">{contrib.mPesaCode || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      contrib.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {contrib.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-8">
              <h2 className="text-2xl font-bold mb-6">Record Contribution</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
                  <Input
                    type="text"
                    value={formData.membershipId}
                    onChange={(e) => setFormData({ ...formData, membershipId: e.target.value })}
                    placeholder="ELC-2024-0001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <Input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Code</label>
                  <Input
                    type="text"
                    value={formData.mPesaCode}
                    onChange={(e) => setFormData({ ...formData, mPesaCode: e.target.value })}
                    placeholder="MPX123456"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">Save</Button>
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
