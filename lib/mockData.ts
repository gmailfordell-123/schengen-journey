/**
 * Static mock data used across customer dashboard and admin dashboard UIs.
 * No backend — pure in-memory fixtures.
 */

export type AppStatus =
  | "Submitted"
  | "Documents Required"
  | "Under Review"
  | "Approved"
  | "Rejected";

export type Appointment = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  package: string;
  date: string;
  time: string;
  status: AppStatus;
  passportNo: string;
  nationality: string;
  dob: string;
  destination: string;
};

export const mockAppointments: Appointment[] = [
  {
    id: "APP-001",
    customerName: "Sarah O'Brien",
    email: "sarah.obrien@email.com",
    phone: "+353 87 123 4567",
    package: "Smart Travel Plan",
    date: "2026-07-10",
    time: "10:00",
    status: "Under Review",
    passportNo: "P1234567",
    nationality: "Irish",
    dob: "1990-03-14",
    destination: "France",
  },
  {
    id: "APP-002",
    customerName: "James Murphy",
    email: "j.murphy@email.com",
    phone: "+353 86 987 6543",
    package: "Essential Start",
    date: "2026-07-15",
    time: "14:30",
    status: "Documents Required",
    passportNo: "P7654321",
    nationality: "Irish",
    dob: "1985-11-22",
    destination: "Germany",
  },
  {
    id: "APP-003",
    customerName: "Amina Khan",
    email: "amina.khan@email.com",
    phone: "+44 7700 900 123",
    package: "Platinum Complete Plan",
    date: "2026-07-08",
    time: "11:00",
    status: "Approved",
    passportNo: "UK987654",
    nationality: "British",
    dob: "1992-07-05",
    destination: "Italy",
  },
  {
    id: "APP-004",
    customerName: "Liam Connelly",
    email: "liam.c@email.com",
    phone: "+353 85 111 2233",
    package: "Smart Travel Plan",
    date: "2026-07-20",
    time: "09:30",
    status: "Submitted",
    passportNo: "P2345678",
    nationality: "Irish",
    dob: "1998-01-30",
    destination: "Spain",
  },
  {
    id: "APP-005",
    customerName: "Fatima Al-Hassan",
    email: "fatima@email.com",
    phone: "+44 7800 123 456",
    package: "Essential Start",
    date: "2026-06-28",
    time: "15:00",
    status: "Rejected",
    passportNo: "UK112233",
    nationality: "British",
    dob: "1988-09-17",
    destination: "Netherlands",
  },
  {
    id: "APP-006",
    customerName: "Daniel Walsh",
    email: "dan.walsh@email.com",
    phone: "+353 89 555 7788",
    package: "Platinum Complete Plan",
    date: "2026-07-25",
    time: "13:00",
    status: "Submitted",
    passportNo: "P3456789",
    nationality: "Irish",
    dob: "1995-04-20",
    destination: "Portugal",
  },
];

export const statusColors: Record<AppStatus, string> = {
  Submitted: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "Documents Required": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "Under Review": "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};
