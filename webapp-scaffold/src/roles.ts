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

export const INSTITUTION = "Yaba College of Technology";
export const SESSION = "2025/2026 · First Semester";
