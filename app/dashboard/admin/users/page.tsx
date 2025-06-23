"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/create-owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("✅ Owner created!");
      setForm({ name: "", email: "", password: "" });
      setUsers((prev) => [...prev, data]);
    } else {
      alert("❌ " + (data.error || "Failed to create owner"));
    }
  };

  const toggleUser = async (userId: string, currentActive: boolean) => {
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ userId, active: !currentActive }),
    });

    const updated: User = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );
    } else {
      alert("❌ Failed to update user");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600">👥 Manage Users</h1>

      {/* Create Owner Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow mb-8"
      >
        <h2 className="font-semibold text-lg">➕ Create New Owner</h2>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Owner"}
        </button>
      </form>

      {/* User List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">📋 All Users</h2>
        {users.map((user) => {
          const isLoading = loadingUserId === user._id;

          return (
            <div
              key={user._id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-gray-600 text-xs">
                  {user.email} ({user.role})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold text-xs px-2 py-1 rounded ${
                    user.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.active ? "✅ Active" : "⛔ Paused"}
                </span>

                <button
                  onClick={() => {
                    setLoadingUserId(user._id);
                    toggleUser(user._id, user.active).finally(() =>
                      setLoadingUserId(null)
                    );
                  }}
                  disabled={isLoading}
                  className={`px-3 py-1 text-xs rounded font-semibold transition ${
                    user.active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {isLoading
                    ? "Loading..."
                    : user.active
                    ? "Pause Access"
                    : "Activate Access"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
