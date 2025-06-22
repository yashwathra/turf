import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function UserDashboardPage() {
  return (
    <DashboardLayout userRole="user">
      <h1 className="text-3xl font-bold mb-4">Welcome User 👋</h1>
      <p>Here are your upcoming bookings and profile options.</p>
    </DashboardLayout>
  );
}
