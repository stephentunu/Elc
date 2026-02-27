import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", contributions: 2400, expenses: 1400 },
  { month: "Feb", contributions: 3200, expenses: 1800 },
  { month: "Mar", contributions: 2800, expenses: 1600 },
  { month: "Apr", contributions: 3900, expenses: 2200 },
  { month: "May", contributions: 4200, expenses: 2400 },
  { month: "Jun", contributions: 3800, expenses: 2100 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">Welcome back, Admin</h1>
          <p className="text-sm md:text-base text-gray-600">Here's what's happening with your club today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Total Members</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">156</p>
              </div>
              <Users className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Active Members</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">142</p>
              </div>
              <Users className="w-8 md:w-12 h-8 md:h-12 text-green-500 opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">This Month</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">KES 42,800</p>
              </div>
              <DollarSign className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Fund Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">KES 128,500</p>
              </div>
              <TrendingUp className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Monthly Contributions</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="contributions" fill="#DC0032" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Fund Balance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="contributions" stroke="#003087" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <Button className="w-full text-xs md:text-sm" variant="outline">Add Member</Button>
            <Button className="w-full text-xs md:text-sm" variant="outline">Record Contribution</Button>
            <Button className="w-full text-xs md:text-sm" variant="outline">Post Announcement</Button>
            <Button className="w-full text-xs md:text-sm" variant="outline">Create Event</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
