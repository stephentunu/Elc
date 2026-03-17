import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, Calendar, Megaphone, Loader2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    balance: 0,
  });
  const [contributions, setContributions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch("/api/trpc/dashboard.getStats?input=%7B%22json%22%3Anull%7D");
      const statsData = await statsRes.json();
      if (statsData?.result?.data?.json) {
        setStats(statsData.result.data.json);
      }

      // Fetch contributions for chart
      const contribRes = await fetch("/api/trpc/contributions.list?input=%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D");
      const contribData = await contribRes.json();
      setContributions(contribData?.result?.data?.json || []);

      // Fetch announcements
      const annRes = await fetch("/api/trpc/announcements.list?input=%7B%22json%22%3A%7B%22limit%22%3A5%2C%22offset%22%3A0%7D%7D");
      const annData = await annRes.json();
      setAnnouncements(annData?.result?.data?.json || []);

      // Fetch events
      const eventsRes = await fetch("/api/trpc/events.list?input=%7B%22json%22%3A%7B%22upcoming%22%3Atrue%7D%7D");
      const eventsData = await eventsRes.json();
      setEvents(eventsData?.result?.data?.json || []);

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Build monthly contributions chart data from real contributions
  const buildChartData = () => {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData: Record<string, number> = {};
    contributions.forEach((c) => {
      const monthName = c.month?.substring(0, 3) || "Unknown";
      monthlyData[monthName] = (monthlyData[monthName] || 0) + parseFloat(c.amount || 0);
    });
    return monthNames
      .filter((m) => monthlyData[m] !== undefined)
      .map((m) => ({ month: m, contributions: monthlyData[m] }));
  };

  const chartData = buildChartData();

  // This month's contributions
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const thisMonthTotal = contributions
    .filter((c) => c.month === currentMonth)
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

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

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Total Members</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">
                  {stats.totalMembers}
                </p>
              </div>
              <Users className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Active Members</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">
                  {stats.activeMembers}
                </p>
              </div>
              <Users className="w-8 md:w-12 h-8 md:h-12 text-green-500 opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">This Month</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">
                  KES {thisMonthTotal.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs md:text-sm font-medium">Fund Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 md:mt-2">
                  KES {stats.balance.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 md:w-12 h-8 md:h-12 text-primary opacity-20 flex-shrink-0 ml-2" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
              Monthly Contributions (KES)
            </h3>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No contribution data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, "Contributions"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="contributions" fill="#DC0032" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
              Contribution Trend
            </h3>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No contribution data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, "Contributions"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="contributions" stroke="#003087" strokeWidth={2} dot={{ fill: "#003087" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Recent Announcements & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-foreground">Recent Announcements</h3>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/announcements")}>View All</Button>
            </div>
            {announcements.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No announcements yet</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Megaphone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.category} • {new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-foreground">Upcoming Events</h3>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/events")}>View All</Button>
            </div>
            {events.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 4).map((e) => (
                  <div key={e.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{e.title}</p>
                      <p className="text-xs text-gray-500">{e.eventDate} • {e.venue || "TBD"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <Button className="w-full text-xs md:text-sm" variant="outline"
              onClick={() => setLocation("/admin/members/add")}>
              Add Member
            </Button>
            <Button className="w-full text-xs md:text-sm" variant="outline"
              onClick={() => setLocation("/admin/contributions")}>
              Record Contribution
            </Button>
            <Button className="w-full text-xs md:text-sm" variant="outline"
              onClick={() => setLocation("/admin/announcements")}>
              Post Announcement
            </Button>
            <Button className="w-full text-xs md:text-sm" variant="outline"
              onClick={() => setLocation("/admin/events")}>
              Create Event
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}