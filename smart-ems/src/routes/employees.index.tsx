import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmsLayout } from "@/components/ems-layout";
import { useEmployees } from "@/lib/ems-store";

export const Route = createFileRoute("/employees/")({
  head: () => ({ meta: [{ title: "Employees — Smart EMS" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const { employees, removeEmployee } = useEmployees();
  const [q, setQ] = useState("");
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.email.toLowerCase().includes(q.toLowerCase()) ||
      e.department.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <EmsLayout title="Employee List">
      <Card className="p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr>
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Salary</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-2 font-mono text-xs">{e.id}</td>
                  <td className="py-3 px-2 font-medium">{e.name}</td>
                  <td className="py-3 px-2 text-muted-foreground">{e.email}</td>
                  <td className="py-3 px-2">{e.department}</td>
                  <td className="py-3 px-2">{e.role}</td>
                  <td className="py-3 px-2">${e.salary.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <Button variant="ghost" size="icon" onClick={() => removeEmployee(e.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </EmsLayout>
  );
}