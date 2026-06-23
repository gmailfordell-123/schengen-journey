/**
 * Navigation definitions used by the navbar, footer, and app shells.
 * Pure data — no business logic.
 */

export type NavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation shown in the public navbar. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Visa Info", href: "/visa-information" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book", href: "/book" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Authentication links shown on the right side of the navbar. */
export const authNav: NavItem[] = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

/** Sidebar navigation for the authenticated dashboard. */
export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Appointments", href: "/dashboard/appointments" },
  { label: "Application Status", href: "/dashboard/status" },
  { label: "Profile", href: "/dashboard/profile" },
];

/** Sidebar navigation for the admin area. */
export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Customers", href: "/admin/customers" },
];

/** Grouped links rendered in the site footer. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];
