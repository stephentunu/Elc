import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jan", income: 5000, expense: 2000 },
  { month: "Feb", income: 6500, expense: 2500 },
  { month: "Mar", income: 7200, expense: 3000 },
  { month: "Apr", income: 6800, expense: 2800 },
  { month: "May", income: 8000, expense: 3200 },
  { month: "Jun", income: 7500, expense: 3100 },
];

const categoryData = [
  { name: "Contributions", value: 35000 },
  { name: "Donations", value: 8000 },
  { name: "Events", value: 5000 },
  { name: "Other", value: 2000 },
];

const expenseData = [
  { name: "Venue Rental", value: 12000 },
  { name: "Catering", value: 8000 },
  { name: "Materials", value: 5000 },
  { name: "Transport", value: 3000 },
];

const COLORS = ["#DC0032", "#003087", "#F5A623", "#666666"];

export default function FinanceReport() {
  const totalIncome = monthlyData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = monthlyData.reduce((sum, d) => sum + d.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Finance Report</h1>
          <p className="text-gray-600">Club financial overview and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Income</p>
            <p className="text-3xl font-bold text-green-600">KES {totalIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Last 6 months</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">KES {totalExpense.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Last 6 months</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Balance</p>
            <p className="text-3xl font-bold text-primary">KES {balance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Net position</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Monthly Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#DC0032" name="Income" />
                <Bar dataKey="expense" fill="#003087" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Fund Balance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={(d) => d.income - d.expense}
                  stroke="#DC0032"
                  name="Monthly Balance"
                  dot={{ fill: "#DC0032" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Income by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: KES ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: KES ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
