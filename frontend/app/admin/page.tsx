"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminAnalytics, getAdminUsers, toggleUserStatus, makeAdmin } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type Analytics = {
  totalUsers: number;
  totalMessages: number;
  totalSessions: number;
  aiMessages: number;
  newUsers: number;
  messagesPerDay: { _id: string; count: number }[];
  ratings: { _id: string; count: number }[];
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
};

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<"analytics" | "users">("analytics");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    fetchData();
  }, [token, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        getAdminAnalytics(),
        getAdminUsers(),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
    } catch {
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId: string) => {
    await toggleUserStatus(userId);
    setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const handleMakeAdmin = async (userId: string) => {
    await makeAdmin(userId);
    setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: "admin" } : u));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      Loading...
    </div>
  );

  const likes = analytics?.ratings.find((r) => r._id === "like")?.count || 0;
  const dislikes = analytics?.ratings.find((r) => r._id === "dislike")?.count || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <span className="font-semibold text-lg">🛡️ Admin Panel</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Hi, {user?.name}</span>
          <button onClick={() => router.push("/chat")} className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg">
            ← Back to Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-4">
        {["analytics", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "analytics" | "users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t === "analytics" ? "📊 Analytics" : "👥 Users"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Analytics Tab */}
        {tab === "analytics" && analytics && (
          <div className="flex flex-col gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: analytics.totalUsers, icon: "👥" },
                { label: "Total Messages", value: analytics.totalMessages, icon: "💬" },
                { label: "Total Sessions", value: analytics.totalSessions, icon: "🗂️" },
                { label: "New Users (7d)", value: analytics.newUsers, icon: "🆕" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-800 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Ratings */}
            <div className="bg-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold mb-4">⭐ AI Response Ratings</h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👍</span>
                  <span className="text-xl font-bold text-green-400">{likes}</span>
                  <span className="text-sm text-gray-400">Likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👎</span>
                  <span className="text-xl font-bold text-red-400">{dislikes}</span>
                  <span className="text-sm text-gray-400">Dislikes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <span className="text-xl font-bold text-blue-400">{analytics.aiMessages}</span>
                  <span className="text-sm text-gray-400">AI Messages</span>
                </div>
              </div>
            </div>

            {/* Messages Per Day */}
            <div className="bg-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold mb-4">📈 Messages Last 7 Days</h2>
              {analytics.messagesPerDay.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {analytics.messagesPerDay.map((d) => (
                    <div key={d._id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24">{d._id}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${Math.min((d.count / 50) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-300 w-6">{d.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-left">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.role === "admin" ? "bg-purple-900 text-purple-300" : "bg-gray-700 text-gray-300"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggle(u._id)}
                          className={`text-xs px-2 py-1 rounded-lg ${u.isActive ? "bg-red-800 hover:bg-red-700 text-red-200" : "bg-green-800 hover:bg-green-700 text-green-200"}`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleMakeAdmin(u._id)}
                            className="text-xs px-2 py-1 rounded-lg bg-purple-800 hover:bg-purple-700 text-purple-200"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
