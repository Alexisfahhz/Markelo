/*
  Oversight: Exam Performance & Institutional Analytics (Screen #53).
  Story: PRD §15 & V2 Oversight Foundations.
  Role: Senior Management (VC / DVC), Institution Admin.
*/
import React, { useState } from "react";
import { AppFrame } from "../ui/shell";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Notice,
  Stat,
  Progress,
  Table,
  Td,
  Row,
  Select,
} from "../ui/kit";
import { ROLES } from "../roles";
import {
  ChartNoAxesColumn,
  TrendingUp,
  Clock,
  ShieldCheck,
  Download,
  AlertTriangle,
  CircleCheckBig,
  FileSpreadsheet,
  Building2,
  Filter,
} from "lucide-react";

export const DEPARTMENT_METRICS = [
  {
    dept: "Computer Science",
    school: "School of Technology",
    courses: 6,
    scripts: 842,
    ingestedPct: 100,
    markingPct: 92,
    approvedPct: 88,
    status: "on-track" as const,
  },
  {
    dept: "Electrical / Electronics Engineering",
    school: "School of Engineering",
    courses: 8,
    scripts: 1120,
    ingestedPct: 100,
    markingPct: 100,
    approvedPct: 100,
    status: "completed" as const,
  },
  {
    dept: "Accountancy",
    school: "School of Management Studies",
    courses: 12,
    scripts: 2450,
    ingestedPct: 98.8,
    markingPct: 84,
    approvedPct: 76,
    status: "attention" as const,
  },
  {
    dept: "Civil Engineering",
    school: "School of Engineering",
    courses: 7,
    scripts: 950,
    ingestedPct: 100,
    markingPct: 96,
    approvedPct: 92,
    status: "on-track" as const,
  },
  {
    dept: "Business Administration",
    school: "School of Management Studies",
    courses: 14,
    scripts: 3100,
    ingestedPct: 100,
    markingPct: 95,
    approvedPct: 90,
    status: "on-track" as const,
  },
  {
    dept: "Science Laboratory Technology",
    school: "School of Pure & Applied Sciences",
    courses: 9,
    scripts: 1380,
    ingestedPct: 100,
    markingPct: 98,
    approvedPct: 95,
    status: "on-track" as const,
  },
];

export const GRADE_DISTRIBUTION = [
  { grade: "A (70-100%)", current: 18.4, baseline: 17.5, color: "bg-emerald-600" },
  { grade: "B (60-69%)", current: 32.1, baseline: 31.0, color: "bg-blue-600" },
  { grade: "C (50-59%)", current: 29.8, baseline: 30.5, color: "bg-sky-500" },
  { grade: "D (45-49%)", current: 11.2, baseline: 12.0, color: "bg-amber-500" },
  { grade: "E (40-44%)", current: 5.1, baseline: 5.5, color: "bg-orange-500" },
  { grade: "F (<40%)", current: 3.4, baseline: 3.5, color: "bg-rose-500" },
];

export function ExamPerformance() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  const filteredDepts = selectedSchool === "all"
    ? DEPARTMENT_METRICS
    : DEPARTMENT_METRICS.filter((d) => d.school === selectedSchool);

  return (
    <AppFrame
      role={ROLES.management}
      activeLabel="Exam performance"
      title="Exam Performance & Institutional Oversight"
      sub="2025/2026 First Semester · Institution-wide examination pacing, grade curves, and defensibility analytics"
    >
      <div className="flex flex-col gap-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
          <Stat
            label="Total Candidates & Exams"
            value="14,820"
            sub="142 courses examined"
            icon={Building2}
          />
          <Stat
            label="Scanning & Ingestion"
            value="99.4%"
            sub="14,732 processed · 88 exceptions"
            icon={TrendingUp}
          />
          <Stat
            label="Marking Completion Rate"
            value="94.2%"
            sub="Avg turnaround: 3.2 days (SLA: 7d)"
            icon={Clock}
          />
          <Stat
            label="Defensibility Index"
            value="100%"
            sub="0 identity breaches · 14 appeals resolved"
            icon={ShieldCheck}
          />
        </div>

        {/* Senate Notification Banner */}
        <Notice tone="brand" title="Senate Results Submission: 5 days remaining">
          Final grade distributions and approved results must be locked by 19 September 2026.
          Currently <strong>5 of 6 faculties</strong> are on pace to meet the statutory publication date.
        </Notice>

        {/* Departmental Progress Matrix */}
        <Card>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sub font-semibold text-text">Departmental Marking & Approval Progress</p>
              <p className="text-caption text-muted">Tracking script batching from intake through Senate approval</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted" />
                <Select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-56"
                >
                  <option value="all">All Schools & Faculties</option>
                  <option value="School of Technology">School of Technology</option>
                  <option value="School of Engineering">School of Engineering</option>
                  <option value="School of Management Studies">School of Management Studies</option>
                  <option value="School of Pure & Applied Sciences">School of Pure & Applied Sciences</option>
                </Select>
              </div>
              <Button variant="secondary" size="sm" icon={Download}>
                Export CSV
              </Button>
            </div>
          </div>

          <Table head={["Department", "Courses", "Scripts", "Ingested", "Marking Progress", "Approved", "Status"]}>
            {filteredDepts.map((d, idx) => (
              <tr key={idx} className="border-b border-border">
                <Td>
                  <p className="font-semibold text-text">{d.dept}</p>
                  <p className="text-caption text-muted">{d.school}</p>
                </Td>
                <Td className="font-medium text-text">{d.courses}</Td>
                <Td className="font-medium text-text">{d.scripts.toLocaleString()}</Td>
                <Td>
                  <span className="font-semibold text-text">{d.ingestedPct}%</span>
                </Td>
                <Td>
                  <div className="flex flex-col gap-1 w-56">
                    <div className="flex justify-between text-caption text-muted">
                      <span>{d.markingPct}% marked</span>
                      <span>{Math.round((d.scripts * d.markingPct) / 100)} / {d.scripts}</span>
                    </div>
                    <Progress value={d.markingPct} max={100} />
                  </div>
                </Td>
                <Td className="font-semibold text-text">{d.approvedPct}%</Td>
                <Td>
                  {d.status === "completed" ? (
                    <Badge tone="success" pill>
                      <CircleCheckBig size={11} className="mr-1 inline" /> Completed
                    </Badge>
                  ) : d.status === "on-track" ? (
                    <Badge tone="brand" pill>
                      On track
                    </Badge>
                  ) : (
                    <Badge tone="warning" pill>
                      <AlertTriangle size={11} className="mr-1 inline" /> Attention
                    </Badge>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* Grade Distribution Analysis */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          <Card className="col-span-2">
            <CardHeader
              title="Institutional Grade Distribution Curve"
              sub="Comparison against 3-year historical academic baseline"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6 text-caption">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-brand" />
                  <span className="text-text font-medium">Current Session (2025/2026)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-border" />
                  <span className="text-muted font-medium">Historical Baseline</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {GRADE_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-caption">
                      <span className="font-semibold text-text w-28">{item.grade}</span>
                      <span className="font-medium text-text">{item.current}%</span>
                      <span className="text-muted text-[11px] w-28 text-right">
                        Baseline: {item.baseline}%
                      </span>
                    </div>
                    <div className="relative h-4 w-full rounded-sm bg-bg overflow-hidden">
                      {/* Baseline tick indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-text/40 z-10"
                        style={{ left: `${item.baseline * 2.5}%` }}
                        title={`Baseline: ${item.baseline}%`}
                      />
                      {/* Current bar */}
                      <div
                        className={`h-full rounded-sm ${item.color}`}
                        style={{ width: `${item.current * 2.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[12px] text-muted border-t border-border pt-3">
                Statistical validity verified: Bell curve falls within normal ±1.8% tolerance. Zero abnormal spikes detected at the 40% pass boundary.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Senate Release Package"
              sub="Statutory documentation for examination board"
            />
            <div className="flex flex-col gap-4 text-caption">
              <div className="rounded-control bg-bg/80 p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text">Full Senate Dossier</span>
                  <Badge tone="brand">Ready</Badge>
                </div>
                <p className="text-muted text-[12px]">
                  Includes master grade broadsheets, statistical curve analysis, and complete anonymity audit certificates.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button full icon={Download}>
                  Export Senate Dossier (PDF)
                </Button>
                <Button variant="secondary" full icon={FileSpreadsheet}>
                  Export Master Broadsheet (XLSX)
                </Button>
              </div>

              <div className="border-t border-border pt-3">
                <p className="uppercase-label mb-1.5">Accreditation Guarantee</p>
                <p className="text-[11px] leading-relaxed text-muted">
                  All marks sealed with SHA-256 cryptographic signatures. 100% compliant with NUC and NBTE accreditation verification standards.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
