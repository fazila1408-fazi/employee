import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmsLayout } from "@/components/ems-layout";
import { useEmployees, useAttendance } from "@/lib/ems-store";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Smart EMS" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const { employees } = useEmployees();
  const { attendance, markAttendance } = useAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const todayMap = new Map(attendance.filter((a) => a.date === today).map((a) => [a.employeeId, a.status]));

  return (
    <EmsLayout title="Attendance Tracking">
      <Card className="p-6">
        <div className="text-sm text-muted-foreground mb-4">Date: {today}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr>
                <th className="py-3 px-2">Employee</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const status = todayMap.get(e.id) ?? "—";
                return (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{e.name}</td>
                    <td className="py-3 px-2">{e.department}</td>
                    <td className="py-3 px-2">
                      <span
                        className={
                          status === "Present"
                            ? "text-green-600 font-medium"
                            : status === "Leave"
                              ? "text-amber-600 font-medium"
                              : status === "Absent"
                                ? "text-red-600 font-medium"
                                : "text-muted-foreground"
                        }
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => markAttendance(e.id, e.name, "Present")}>
                        Present
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => markAttendance(e.id, e.name, "Absent")}>
                        Absent
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => markAttendance(e.id, e.name, "Leave")}>
                        Leave
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </EmsLayout>
  );
}