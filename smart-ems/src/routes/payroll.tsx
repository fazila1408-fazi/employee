import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { EmsLayout } from "@/components/ems-layout";
import { usePayroll } from "@/lib/ems-store";

export const Route = createFileRoute("/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Smart EMS" }] }),
  component: PayrollPage,
});

function PayrollPage() {
  const { payroll } = usePayroll();
  const total = payroll.reduce((s, p) => s + p.net, 0);

  return (
    <EmsLayout title="Payroll Management">
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-muted-foreground">Showing {payroll.length} payroll records</div>
          <div className="text-sm font-semibold">Total Net Payout: ${total.toLocaleString()}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr>
                <th className="py-3 px-2">Employee</th>
                <th className="py-3 px-2">Month</th>
                <th className="py-3 px-2">Basic</th>
                <th className="py-3 px-2">Allowance</th>
                <th className="py-3 px-2">Deduction</th>
                <th className="py-3 px-2">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 px-2 font-medium">{p.employeeName}</td>
                  <td className="py-3 px-2">{p.month}</td>
                  <td className="py-3 px-2">${p.basic.toLocaleString()}</td>
                  <td className="py-3 px-2 text-green-600">+${p.allowance.toLocaleString()}</td>
                  <td className="py-3 px-2 text-red-600">-${p.deduction.toLocaleString()}</td>
                  <td className="py-3 px-2 font-semibold">${p.net.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </EmsLayout>
  );
}