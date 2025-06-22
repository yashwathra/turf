// app/dashboard/admin/page.tsx
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout userRole="admin">
      <h1 className="text-2xl font-bold mb-4">🧑‍💼 Admin Dashboard</h1>
      <ul className="space-y-2">
        <li>👥 Manage all users</li>
        <li>🌍 View all turfs</li>
        <li>💰 Revenue reports</li>
        <li>📊 System stats</li>
      </ul>
    </DashboardLayout>
  );
}
