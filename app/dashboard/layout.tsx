// app/dashboard/layout.tsx
import { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPageLayout({ children }: { children: ReactNode }) {
  // We'll detect role inside DashboardLayout OR use context later
  return <DashboardLayout>{children}</DashboardLayout>;
}
