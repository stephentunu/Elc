import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Loader2, Trash2 } from "lucide-react";

const COLORS = ["#DC0032", "#003087", "#F5A623", "#10B981", "#666666"];

export default function FinanceReport() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "Income", amount: "", description: "",
    category: "", reference: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, balRes] = await Promise.all([
        fetch("/api/trpc/finance.listTransactions?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D"),
        fetch("/api/trpc/finance.getBalance?input=%7B%22json%22%3Anull%7D"),
      ]);
      const txData = await txRes.json();
      const balData = await balRes.json();
      setTransactions(txData?.result?.data?.json || []);
      setBalance(balData?.result?.data?.json || 0);
    } catch (err) {
      console.error("Failed to fetch finance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/finance.recordTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            type: formData.type,
            amount: parseFloat(formData.amount),
            description: formData.description,
            category: formData.category || undefined,
            reference: formData.reference || undefined,
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error?.json?.message || "Failed to record transaction");
      }
      setFormData({ type: "Income", amount: "", description: "", category: "", reference: "" });
      setShowModal(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to record transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await fetch("/api/trpc/finance.deleteTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: id }),
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // Build chart data from real transactions
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const date = new Date(t.transactionDate || t.createdAt);
    const key = monthNames[date.getMonth()];
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    if (t.type === "Income") monthlyMap[key].income += parseFloat(t.amount || 0);
    else monthlyMap[key].expense += parseFloat(t.amount || 0);
  });
  const chartData = monthNames.filter(m => monthlyMap[m]).map(m => ({ month: m, ...monthlyMap[m] }));

  // Category breakdown
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = t.category || "Other";
    if (t.type === "Income") incomeByCategory[cat] = (incomeByCategory[cat] || 0) + parseFloat(t.amount || 0);
    else expenseByCategory[cat] = (expenseByCategory[cat] || 0) + parseFloat(t.amount || 0);
  });
  const incomeCategories = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));
  const expenseCategories = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const totalIncome = transactions.filter(t => t.type === "Income").reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Finance Report</h1>
            <p className="text-gray-600">Club financial overview and analytics</p>
          </div>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />Record Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Income</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">KES {totalIncome.toLocaleString()}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-2xl md:text-3xl font-bold text-red-600">KES {totalExpense.toLocaleString()}</p>
          </Card>
          <Card className="p-4 md:p-6">
            <p className="text-gray-600 text-sm">Current Balance</p>
            <p className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-red-600"}`}>
              KES {balance.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
            <Card className="p-4 md:p-6">
              <h2 className="text-lg font-bold mb-4">Monthly Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" radius={[4,4,0,0]} />
                  <Bar dataKey="expense" fill="#DC0032" name="Expenses" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-rows-2 gap-6">
              {incomeCategories.length > 0 && (
                <Card className="p-4 md:p-6">
                  <h2 className="text-lg font-bold mb-4">Income by Category</h2>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={incomeCategories} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                        {incomeCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}
              {expenseCategories.length > 0 && (
                <Card className="p-4 md:p-6">
                  <h2 className="text-lg font-bold mb-4">Expenses by Category</h2>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                        {expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `KES ${Number(v).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">All Transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No transactions yet. Click "Record Transaction" to add one.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Balance After</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700 text-sm">{t.transactionDate || "-"}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        t.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 text-sm">{t.description}</td>
                    <td className="px-6 py-3 text-gray-700 text-sm">{t.category || "-"}</td>
                    <td className="px-6 py-3 font-medium text-sm">
                      <span className={t.type === "Income" ? "text-green-600" : "text-red-600"}>
                        {t.type === "Income" ? "+" : "-"}KES {parseFloat(t.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 text-sm">
                      KES {parseFloat(t.balanceAfter || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(t.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Record Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-8">
              <h2 className="text-2xl font-bold mb-6">Record Transaction</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                  <Input type="number" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <Input type="text" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Transaction description" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Input type="text" value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Subscription, Venue, Catering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                  <Input type="text" value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="e.g. M-Pesa code, receipt number" />
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