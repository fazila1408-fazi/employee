import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmsLayout } from "@/components/ems-layout";
import { useEmployees } from "@/lib/ems-store";

export const Route = createFileRoute("/employees/register")({
  head: () => ({ meta: [{ title: "Register Employee — Smart EMS" }] }),
  component: RegisterEmployee,
});

function RegisterEmployee() {
  const { addEmployee } = useEmployees();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    salary: "",
    joinDate: new Date().toISOString().slice(0, 10),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name: form.name,
      email: form.email,
      department: form.department,
      role: form.role,
      salary: Number(form.salary) || 0,
      joinDate: form.joinDate,
    });
    navigate({ to: "/employees" });
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <EmsLayout title="Register Employee">
      <Card className="p-6 max-w-2xl">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Full Name</Label>
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Department</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            >
              <option>Engineering</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Operations</option>
              <option>Sales</option>
            </select>
          </div>
          <div>
            <Label>Role / Title</Label>
            <Input required value={form.role} onChange={(e) => set("role", e.target.value)} />
          </div>
          <div>
            <Label>Salary (USD)</Label>
            <Input type="number" required value={form.salary} onChange={(e) => set("salary", e.target.value)} />
          </div>
          <div>
            <Label>Join Date</Label>
            <Input type="date" value={form.joinDate} onChange={(e) => set("joinDate", e.target.value)} />
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end mt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/employees" })}>
              Cancel
            </Button>
            <Button type="submit">Register Employee</Button>
          </div>
        </form>
      </Card>
    </EmsLayout>
  );
}