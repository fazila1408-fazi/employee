import { useEffect, useState } from "react";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
};

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: "Present" | "Absent" | "Leave";
};

export type PayrollRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basic: number;
  allowance: number;
  deduction: number;
  net: number;
};

const seedEmployees: Employee[] = [
  { id: "EMP001", name: "Aarav Sharma", email: "aarav@company.com", department: "Engineering", role: "Senior Developer", salary: 85000, joinDate: "2022-03-15" },
  { id: "EMP002", name: "Priya Patel", email: "priya@company.com", department: "Human Resources", role: "HR Manager", salary: 72000, joinDate: "2021-07-01" },
  { id: "EMP003", name: "Rohan Mehta", email: "rohan@company.com", department: "Finance", role: "Accountant", salary: 65000, joinDate: "2023-01-20" },
  { id: "EMP004", name: "Sneha Iyer", email: "sneha@company.com", department: "Marketing", role: "Marketing Lead", salary: 78000, joinDate: "2022-11-05" },
  { id: "EMP005", name: "Vikram Singh", email: "vikram@company.com", department: "Engineering", role: "Frontend Developer", salary: 68000, joinDate: "2023-06-10" },
];

const seedAttendance: AttendanceRecord[] = seedEmployees.map((e, i) => ({
  id: `ATT${i + 1}`,
  employeeId: e.id,
  employeeName: e.name,
  date: new Date().toISOString().slice(0, 10),
  status: i % 4 === 0 ? "Leave" : "Present",
}));

const seedPayroll: PayrollRecord[] = seedEmployees.map((e, i) => ({
  id: `PAY${i + 1}`,
  employeeId: e.id,
  employeeName: e.name,
  month: "2026-06",
  basic: e.salary,
  allowance: Math.round(e.salary * 0.1),
  deduction: Math.round(e.salary * 0.08),
  net: e.salary + Math.round(e.salary * 0.1) - Math.round(e.salary * 0.08),
}));

function load<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function save<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new Event("ems-store-change"));
}

export function useEmployees() {
  const [data, setData] = useState<Employee[]>([]);
  useEffect(() => {
    const sync = () => setData(load("ems_employees", seedEmployees));
    sync();
    window.addEventListener("ems-store-change", sync);
    return () => window.removeEventListener("ems-store-change", sync);
  }, []);
  return {
    employees: data,
    addEmployee: (e: Omit<Employee, "id">) => {
      const list = load("ems_employees", seedEmployees);
      const id = `EMP${String(list.length + 1).padStart(3, "0")}`;
      save("ems_employees", [...list, { ...e, id }]);
    },
    removeEmployee: (id: string) => {
      const list = load("ems_employees", seedEmployees);
      save("ems_employees", list.filter((x) => x.id !== id));
    },
  };
}

export function useAttendance() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  useEffect(() => {
    const sync = () => setData(load("ems_attendance", seedAttendance));
    sync();
    window.addEventListener("ems-store-change", sync);
    return () => window.removeEventListener("ems-store-change", sync);
  }, []);
  return {
    attendance: data,
    markAttendance: (employeeId: string, employeeName: string, status: AttendanceRecord["status"]) => {
      const list = load("ems_attendance", seedAttendance);
      const today = new Date().toISOString().slice(0, 10);
      const idx = list.findIndex((a) => a.employeeId === employeeId && a.date === today);
      const rec: AttendanceRecord = {
        id: idx >= 0 ? list[idx].id : `ATT${list.length + 1}`,
        employeeId,
        employeeName,
        date: today,
        status,
      };
      if (idx >= 0) list[idx] = rec;
      else list.push(rec);
      save("ems_attendance", list);
    },
  };
}

export function usePayroll() {
  const [data, setData] = useState<PayrollRecord[]>([]);
  useEffect(() => {
    const sync = () => setData(load("ems_payroll", seedPayroll));
    sync();
    window.addEventListener("ems-store-change", sync);
    return () => window.removeEventListener("ems-store-change", sync);
  }, []);
  return { payroll: data };
}

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    setUser(localStorage.getItem("ems_user"));
  }, []);
  return {
    user,
    login: (email: string) => {
      localStorage.setItem("ems_user", email);
      setUser(email);
    },
    logout: () => {
      localStorage.removeItem("ems_user");
      setUser(null);
    },
  };
}