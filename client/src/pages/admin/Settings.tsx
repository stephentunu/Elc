import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Lock } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admins@gmail.com",
    phone: "+254 (0) 123 456 789",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [clubData, setClubData] = useState({
    clubName: "Multimedia University Equity Leaders' Club",
    monthlySubscription: "1000",
    contactEmail: "elc@mmu.ac.ke",
    contactPhone: "+254 (0) 123 456 789",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-gray-600">Manage your admin profile and club settings</p>
        </div>

        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Admin Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "password"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("club")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "club"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Club Settings
          </button>
        </div>

        {activeTab === "profile" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "password" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button type="submit" size="lg">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "club" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Club Settings</h2>
            <form onSubmit={handleClubSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                <Input
                  type="text"
                  value={clubData.clubName}
                  onChange={(e) => setClubData({ ...clubData, clubName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Subscription Amount (KES)</label>
                <Input
                  type="number"
                  value={clubData.monthlySubscription}
                  onChange={(e) => setClubData({ ...clubData, monthlySubscription: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <Input
                  type="email"
                  value={clubData.contactEmail}
                  onChange={(e) => setClubData({ ...clubData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <Input
                  type="tel"
                  value={clubData.contactPhone}
                  onChange={(e) => setClubData({ ...clubData, contactPhone: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
