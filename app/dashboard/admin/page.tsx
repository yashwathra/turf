// app/dashboard/admin/page.tsx
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">🧑‍💼 Admin Dashboard</h1>
     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Users */}
        <Link href="/dashboard/admin/users">
          <div className="p-6 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
            <h2 className="text-red-600 font-semibold text-lg mb-1">👥 Manage Users</h2>
            <p className="text-sm text-gray-600">Create, pause, and activate accounts</p>
          </div>
        </Link>  

        {/* View All Turfs (future) */}
        <Link href="/dashboard/admin/turfs">
          <div className="p-6 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
            <h2 className="text-red-600 font-semibold text-lg mb-1">🌍 All Turfs</h2>
            <p className="text-sm text-gray-600">View and manage all turfs</p>
          </div>
        </Link>
        <div className="p-6 bg-gray-100 rounded shadow opacity-60 cursor-not-allowed">
          <h2 className="text-gray-400 font-semibold text-lg mb-1">🌍 All Turfs</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>

        {/* Revenue Reports (future) */}
        <div className="p-6 bg-gray-100 rounded shadow opacity-60 cursor-not-allowed">
          <h2 className="text-gray-400 font-semibold text-lg mb-1">💰 Revenue Reports</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>

        {/* System Stats (future) */}
        <div className="p-6 bg-gray-100 rounded shadow opacity-60 cursor-not-allowed">
          <h2 className="text-gray-400 font-semibold text-lg mb-1">📊 System Stats</h2>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>
    </>
  );
}
