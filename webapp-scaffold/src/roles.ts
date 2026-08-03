/*
  Roles and navigation.

  Sources: PRD v3.4 §5 (Personas) and §6 (Permission Model); User Stories
  (19 July, derived from PRD v3.4) Epic I and Epic J.

  Nav items only appear for a role PRD §6 actually grants the capability to.
  Icon names are Lucide component names. The whole product uses Lucide.
*/
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileScan,
  ScrollText,
  Settings,
  BookOpenCheck,
  FileSpreadsheet,
  ScanLine,
  TriangleAlert,
  GraduationCap,
  IdCard,
  PenLine,
  ListChecks,
  ClipboardList,
  ChartNoAxesColumn,
  Flag,
  ShieldCheck,
  Undo2,
  FileCheck2,
  LifeBuoy,
} from "lucide-react";

export type RoleKey =
  | "admin"
  | "officer"
  | "lecturer"
  | "ta"
  | "moderator"
  | "management";

export type NavItem = { label: string; icon: LucideIcon; screen?: string; badge?: string };

export type Role = {
  key: RoleKey;
  title: string;
  person: string;
  /** Why this person opens Markelo at all. This drives the dashboard's top slot. */
  primaryJob: string;
  /** PRD §16 and User Story J2: MFA is required for Institution Admin and above. */
  requiresMfa: boolean;
  nav: NavItem[];
};

export const ROLES: Record<RoleKey, Role> = {
  admin: {
    key: "admin",
    title: "Institution Admin",
    person: "Mr. Femi Adeyemi",
    primaryJob: "Get the institution set up and keep the right people in the right roles.",
    requiresMfa: true,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-admin" },
      { label: "Courses", icon: Building2 },
      { label: "People & roles", icon: Users, badge: "2" },
      { label: "Booklet profile", icon: BookOpenCheck },
      { label: "Result correction", icon: Undo2 },
      { label: "Audit trail", icon: ScrollText },
      { label: "Settings", icon: Settings },
    ],
  },
  officer: {
    key: "officer",
    title: "Exam Officer",
    person: "Mrs. Adaeze Okonkwo",
    primaryJob: "Move every exam from scanning to a finalised result without losing a script.",
    requiresMfa: false,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-officer" },
      { label: "Exams", icon: ClipboardList },
      { label: "Marking scheme", icon: ListChecks },
      { label: "Student data", icon: FileSpreadsheet },
      { label: "Scan batches", icon: ScanLine },
      { label: "Exception queue", icon: TriangleAlert, badge: "14" },
      { label: "Results", icon: FileCheck2 },
      { label: "Identity registry", icon: IdCard },
    ],
  },
  lecturer: {
    key: "lecturer",
    title: "Lecturer",
    person: "Dr. Balogun Salami",
    primaryJob: "Mark my share, split the rest across my TAs, and see where marking stands.",
    requiresMfa: false,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-lecturer" },
      { label: "My marking", icon: PenLine, badge: "62" },
      { label: "Marking assignment", icon: Users },
      { label: "Marking progress", icon: ChartNoAxesColumn },
      { label: "Marking scheme", icon: ListChecks },
      { label: "My courses", icon: GraduationCap },
    ],
  },
  ta: {
    key: "ta",
    title: "Teaching Assistant",
    person: "Chidinma Eze",
    primaryJob: "Mark the scripts assigned to me, and not lose work when the power goes.",
    requiresMfa: false,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-ta" },
      { label: "My marking", icon: PenLine, badge: "38" },
      { label: "Marking progress", icon: ChartNoAxesColumn },
      { label: "Flagged for review", icon: Flag, badge: "3" },
    ],
  },
  moderator: {
    key: "moderator",
    title: "Moderator / HOD",
    person: "Prof. Eze Nwachukwu",
    primaryJob: "Sample-check marking quality and be able to defend any grade that is disputed.",
    requiresMfa: true,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-moderator" },
      { label: "Moderation queue", icon: ShieldCheck, badge: "21" },
      { label: "Returned scripts", icon: Undo2 },
      { label: "Result approval", icon: FileCheck2 },
      { label: "Audit trail", icon: ScrollText },
    ],
  },
  management: {
    key: "management",
    title: "Senior Management",
    person: "Prof. R. Adewale, VC's Office",
    primaryJob: "See whether exams across the institution are on time and defensible.",
    requiresMfa: true,
    nav: [
      { label: "Dashboard", icon: LayoutDashboard, screen: "dash-management" },
      { label: "Exam performance", icon: ChartNoAxesColumn },
      { label: "Audit trail", icon: ScrollText },
      { label: "Reports", icon: FileScan },
    ],
  },
};

export const ROLE_ORDER: RoleKey[] = [
  "admin",
  "officer",
  "lecturer",
  "ta",
  "moderator",
  "management",
];

/*
  THE CATEGORISED MENU.

  One menu structure shared by all six roles, rather than six different menus.
  A role's own `nav` array above stays the single source of truth for what it
  may reach: this list only decides order and grouping, and the sidebar locks
  anything the role's own array does not contain. Nothing here grants or
  removes a permission, so the PRD §6 model is unchanged by it.

  Why one shared menu at all. Six different-shaped menus meant a Teaching
  Assistant had no way of knowing Moderation exists, let alone that it is
  someone else's job. Showing the whole product with a padlock on what is not
  yours makes the permission model legible, which matters more than usual here
  because this is an audit product: a user who cannot see the shape of the
  system cannot reason about who did what to a result.

  Groups follow the order work actually happens in, set up an exam, get the
  scripts in, mark them, moderate them, release results, and only then the
  standing institution settings. That is principle P1, familiar before novel:
  the menu reads in the same order as the job.

  ONE ADDITION, and it is flagged rather than quiet. "Help and guidance" is not
  in any role's nav array and has no screen yet. It is here because principle
  P3 in DesignSystem/00-define.md commits to guidance living in the interface
  and never in a manual, which needs somewhere to live. Everything else in this
  list is an existing destination. No other placeholder was invented.
*/
/*
  `icon` belongs to the parent row in the sidebar tree. Children below it are
  text on an indent rail and carry no icon of their own, so a parent icon can
  never collide with one of its children.
*/
export type NavGroup = { label?: string; icon?: LucideIcon; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  { items: [{ label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Exam setup",
    icon: ClipboardList,
    items: [
      { label: "Exams", icon: ClipboardList },
      { label: "Marking scheme", icon: ListChecks },
      { label: "Student data", icon: FileSpreadsheet },
      { label: "Booklet profile", icon: BookOpenCheck },
    ],
  },
  {
    label: "Scripts",
    icon: ScanLine,
    items: [
      { label: "Scan batches", icon: ScanLine },
      { label: "Exception queue", icon: TriangleAlert },
      { label: "Identity registry", icon: IdCard },
    ],
  },
  {
    label: "Marking",
    icon: PenLine,
    items: [
      { label: "My marking", icon: PenLine },
      { label: "My courses", icon: GraduationCap },
      { label: "Marking assignment", icon: Users },
      { label: "Marking progress", icon: ChartNoAxesColumn },
      { label: "Flagged for review", icon: Flag },
    ],
  },
  {
    label: "Moderation",
    icon: ShieldCheck,
    items: [
      { label: "Moderation queue", icon: ShieldCheck },
      { label: "Returned scripts", icon: Undo2 },
    ],
  },
  {
    label: "Results",
    icon: FileCheck2,
    items: [
      { label: "Results", icon: FileCheck2 },
      { label: "Result approval", icon: FileCheck2 },
      { label: "Result correction", icon: Undo2 },
    ],
  },
  {
    label: "Oversight",
    icon: ChartNoAxesColumn,
    items: [
      { label: "Exam performance", icon: ChartNoAxesColumn },
      { label: "Reports", icon: FileScan },
      { label: "Audit trail", icon: ScrollText },
    ],
  },
  {
    label: "Institution",
    icon: Building2,
    items: [
      { label: "Courses", icon: Building2 },
      { label: "People & roles", icon: Users },
    ],
  },
  {
    label: "Support",
    icon: LifeBuoy,
    items: [
      { label: "Help & guidance", icon: LifeBuoy },
      { label: "Settings", icon: Settings },
    ],
  },
];

export const INSTITUTION = "Yaba College of Technology";
export const SESSION = "2025/2026 · First Semester";
