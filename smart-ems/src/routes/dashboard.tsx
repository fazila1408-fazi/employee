import { createFileRoute } from "@tanstack/react-router";
import { Users, Building2, CalendarCheck, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmsLayout } from "@/components/ems-layout";
import { useEmployees, useAttendance, usePayroll } from "@/lib/ems-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Smart EMS" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { employees } = useEmployees();
  const { attendance } = useAttendance();
  const { payroll } = usePayroll();
  const departments = new Set(employees.map((e) => e.department)).size;
  const presentToday = attendance.filter((a) => a.status === "Present").length;
  const totalPayroll = payroll.reduce((s, p) => s + p.net, 0);

  const stats = [
    { label: "Total Employees", value: employees.length, icon: Users, color: "bg-blue-500/10 text-blue-600" },
    { label: "Departments", value: departments, icon: Building2, color: "bg-purple-500/10 text-purple-600" },
    { label: "Present Today", value: presentToday, icon: CalendarCheck, color: "bg-green-500/10 text-green-600" },
    { label: "Monthly Payroll", value: `$${totalPayroll.toLocaleString()}`, icon: Wallet, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <EmsLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-6">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Employees</h3>
          <ul className="space-y-2">
            {employees.slice(-5).reverse().map((e) => (
              <li key={e.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                <span>{e.name}</span>
                <span className="text-muted-foreground">{e.department}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Today's Attendance</h3>
          <ul className="space-y-2">
            {attendance.slice(0, 5).map((a) => (
              <li key={a.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                <span>{a.employeeName}</span>
                <span className={a.status === "Present" ? "text-green-600" : a.status === "Leave" ? "text-amber-600" : "text-red-600"}>
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </EmsLayout>
  );
}