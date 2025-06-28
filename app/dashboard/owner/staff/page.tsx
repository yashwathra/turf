"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  salary: number;
  shiftStart: string;
  shiftEnd: string;
  password: string;
  canAccessDashboard: boolean;
  permissions: string[];
}

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
  canAccessDashboard: boolean;
}

export default function StaffPage() {
  const [form, setForm] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    salary: 0,
    shiftStart: "09:00",
    shiftEnd: "18:00",
    password: "",
    canAccessDashboard: false,
    permissions: [],
  });

  const [staffList, setStaffList] = useState<Staff[]>([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/owner/staff/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setStaffList(data.staffs || []);
    } catch {
      toast.error("Failed to load staff list");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: target.checked }));
    } else if (name === "salary") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePermission = (perm: string) => {
    setForm((prev) => {
      const newPerms = prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/owner/staff/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...form }),
    });

    if (res.ok) {
      toast.success("✅ Staff added successfully");
      fetchStaff();
    } else {
      toast.error("❌ Failed to add staff");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Manage Staff</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white p-6 rounded-xl shadow"
      >
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-3 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-3 border rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="p-3 border rounded" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="p-3 border rounded" />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Role" className="p-3 border rounded" required />
        <input name="salary" value={form.salary} onChange={handleChange} type="number" placeholder="Salary" className="p-3 border rounded" />
        <input name="shiftStart" value={form.shiftStart} onChange={handleChange} type="time" className="p-3 border rounded" />
        <input name="shiftEnd" value={form.shiftEnd} onChange={handleChange} type="time" className="p-3 border rounded" />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="p-3 border rounded" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="canAccessDashboard" checked={form.canAccessDashboard} onChange={handleChange} />
          Can access dashboard
        </label>

        {form.canAccessDashboard && (
          <div className="col-span-2">
            <p className="text-sm font-semibold mb-2">Permissions</p>
            <label className="mr-4">
              <input type="checkbox" checked={form.permissions.includes("bookings")} onChange={() => togglePermission("bookings")} /> Bookings
            </label>
            {/* Add more permissions if needed */}
          </div>
        )}

        <div className="md:col-span-2">
          <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded">Add Staff</button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4">Staff List</h2>
      <div className="bg-white p-4 rounded-xl shadow">
        {staffList.length === 0 ? (
          <p className="text-gray-500">No staff found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff._id} className="border-t">
                  <td className="py-2">{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.role}</td>
                  <td>
                    {staff.shiftStart} - {staff.shiftEnd}
                  </td>
                  <td>{staff.canAccessDashboard ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
