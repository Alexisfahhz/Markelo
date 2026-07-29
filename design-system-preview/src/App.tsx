import React from "react";
import {
  Button,
  IconButton,
  Badge,
  Card,
  Field,
  TextInput,
  Textarea,
  Select,
  Row,
  Stack,
} from "./components/primitives";
import {
  IconArrowRight,
  IconPlus,
  IconDownload,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import { DataTable } from "./components/tables";
import { Sidebar, Topbar, Tabs, Breadcrumbs } from "./components/nav";
import { Toast, Banner, SyncChip } from "./components/feedback";
import { ModalDemo, ConfirmDemo, SidePanelDemo } from "./components/overlays";
import { Stepper, ProgressBar, SkeletonRows } from "./components/progress";
import { EmptyState, ErrorState, DeniedState, EmptyInboxState } from "./components/states";
import {
  MarkEntryPanel,
  ValidationReport,
  ModerationCompare,
  ScanStatusList,
} from "./components/composites";
import { courses, lecturers } from "./mock";

/* ---------- gallery scaffolding ---------- */

const SECTIONS = [
  ["foundations", "Foundations"],
  ["buttons", "1 · Buttons"],
  ["badges", "2 · Status badges"],
  ["forms", "3 · Form inputs"],
  ["table", "4 · Data table"],
  ["nav", "5 · Navigation"],
  ["feedback", "6 · Feedback"],
  ["overlays", "7 · Overlays"],
  ["progress", "8 · Progress"],
  ["states", "9 · Empty / error / denied"],
  ["composites", "10 · App composites"],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="text-[22px] font-bold text-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="uppercase-label mb-3">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Swatch({ name, hex, dark }: { name: string; hex: string; dark?: boolean }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <div className="h-16" style={{ background: hex }} />
      <div className="px-3 py-2">
        <p className="text-[12px] font-semibold text-text">{name}</p>
        <p className="font-mono text-[11px] text-muted">{hex}</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-10">
      {/* jump nav */}
      <aside className="sticky top-10 hidden h-fit w-52 flex-none lg:block">
        <div className="flex items-center gap-2 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-control bg-brand text-[15px] font-bold text-on-dark">
            M
          </div>
          <span className="text-[15px] font-bold">Markelo</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-control px-3 py-1.5 text-[13px] text-muted hover:bg-brand-light hover:text-brand"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* content */}
      <main className="min-w-0 flex-1">
        <header className="mb-10">
          <p className="uppercase-label">Design system preview · v0.1</p>
          <h1 className="mt-2 text-[28px] font-bold text-text">Markelo component library</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-muted">
            The 10 component categories the app needs, built to the Markelo Design System PDF. Tokens are named to
            mirror your Figma variables (<span className="font-mono text-[13px]">bg-brand</span> ={" "}
            <span className="font-mono text-[13px]">color/brand</span>), so translating each of these into Figma is a
            direct mapping. Font is Plus Jakarta Sans, the real one.
          </p>
        </header>

        <div className="flex flex-col gap-14">
          {/* FOUNDATIONS */}
          <Section id="foundations" title="Foundations">
            <Stack className="gap-8">
              <Specimen label="Colour, primary & neutral">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <Swatch name="brand" hex="#1A56A0" />
                  <Swatch name="brand-light" hex="#E8F1FB" />
                  <Swatch name="brand-dark" hex="#0C3D7A" />
                  <Swatch name="text" hex="#1A1A1A" />
                  <Swatch name="muted" hex="#666666" />
                  <Swatch name="border" hex="#CCCCCC" />
                </div>
              </Specimen>
              <Specimen label="Colour, semantic">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <Swatch name="success" hex="#1A7A4A" />
                  <Swatch name="success-light" hex="#E6F4ED" />
                  <Swatch name="error" hex="#C0392B" />
                  <Swatch name="error-light" hex="#FDECEA" />
                  <Swatch name="warning" hex="#C47D00" />
                  <Swatch name="warning-light" hex="#FFF3CD" />
                </div>
              </Specimen>
              <Specimen label="Type scale, Plus Jakarta Sans">
                <Card>
                  <div className="flex flex-col gap-3">
                    <p className="text-[28px] font-bold leading-tight">Page title · 28 Bold</p>
                    <p className="text-[22px] font-semibold">Section heading · 22 SemiBold</p>
                    <p className="text-[18px] font-semibold">Card heading · 18 SemiBold</p>
                    <p className="text-[16px] font-medium">Sub-heading · 16 Medium</p>
                    <p className="text-[14px]">Body · 14 Regular, most of the interface lives here.</p>
                    <p className="text-[12px] text-muted">Caption · 12 Regular · #666666</p>
                    <p className="uppercase-label">Section label · 11 Medium uppercase</p>
                  </div>
                </Card>
              </Specimen>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Specimen label="Spacing, 4 / 8 / 12 / 16 / 24 / 32 / 48">
                  <div className="flex items-end gap-2">
                    {[4, 8, 12, 16, 24, 32, 48].map((s) => (
                      <div key={s} className="flex flex-col items-center gap-1">
                        <div className="bg-brand" style={{ width: s, height: s }} />
                        <span className="font-mono text-[11px] text-muted">{s}</span>
                      </div>
                    ))}
                  </div>
                </Specimen>
                <Specimen label="Radius, 4 badge / 8 control / 12 card / 100 pill">
                  <div className="flex items-end gap-4">
                    {[
                      ["4", "rounded-badge"],
                      ["8", "rounded-control"],
                      ["12", "rounded-card"],
                      ["100", "rounded-pill"],
                    ].map(([n, cls]) => (
                      <div key={n} className="flex flex-col items-center gap-1">
                        <div className={`h-14 w-14 border border-border bg-brand-light ${cls}`} />
                        <span className="font-mono text-[11px] text-muted">{n}</span>
                      </div>
                    ))}
                  </div>
                </Specimen>
              </div>
            </Stack>
          </Section>

          {/* 1 BUTTONS */}
          <Section id="buttons" title="1 · Buttons">
            <Card large>
              <Stack className="gap-6">
                <Specimen label="Variants, verb-first labels, one primary per screen">
                  <Row>
                    <Button variant="primary" rightIcon={IconArrowRight}>Grade scripts</Button>
                    <Button variant="secondary">Export results</Button>
                    <Button variant="danger" leftIcon={IconTrash}>Delete script</Button>
                    <Button variant="ghost">Cancel</Button>
                    <Button disabled>Grade scripts</Button>
                  </Row>
                </Specimen>
                <Specimen label="Sizes & icon buttons">
                  <Row>
                    <Button size="sm" leftIcon={IconPlus}>New exam</Button>
                    <Button size="md" leftIcon={IconPlus}>New exam</Button>
                    <IconButton icon={IconEdit} label="Edit" />
                    <IconButton icon={IconDownload} label="Download" />
                  </Row>
                </Specimen>
              </Stack>
            </Card>
          </Section>

          {/* 2 BADGES */}
          <Section id="badges" title="2 · Status badges">
            <Card large>
              <Row className="gap-3">
                <Badge kind="graded" />
                <Badge kind="in-progress" />
                <Badge kind="pending" />
                <Badge kind="missing" />
                <Badge kind="not-started" />
                <Badge kind="flagged" />
              </Row>
            </Card>
          </Section>

          {/* 3 FORMS */}
          <Section id="forms" title="3 · Form inputs">
            <Card large>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Course" htmlFor="c" required>
                  <Select id="c" defaultValue={courses[0]}>
                    {courses.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Lecturer" htmlFor="l" required>
                  <Select id="l" defaultValue={lecturers[0]}>
                    {lecturers.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Examination title" htmlFor="t" hint="Shown to the examination officer only">
                  <TextInput id="t" placeholder="e.g. First Semester Final" />
                </Field>
                <Field label="Matric number" htmlFor="m" error="This matric number already exists on the roster">
                  <TextInput id="m" defaultValue="CSC/2025/002" invalid />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Current process" htmlFor="p">
                    <Textarea id="p" placeholder="Briefly describe your current examination process…" />
                  </Field>
                </div>
              </div>
            </Card>
          </Section>

          {/* 4 TABLE */}
          <Section id="table" title="4 · Data table">
            <DataTable />
          </Section>

          {/* 5 NAV */}
          <Section id="nav" title="5 · Navigation">
            <Stack className="gap-6">
              <Specimen label="Topbar & breadcrumbs">
                <Stack className="gap-3">
                  <Topbar />
                  <Breadcrumbs />
                </Stack>
              </Specimen>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
                <Specimen label="Sidebar, role-aware, blue-dark">
                  <div className="h-[380px]">
                    <Sidebar />
                  </div>
                </Specimen>
                <Specimen label="Tabs">
                  <Tabs />
                </Specimen>
              </div>
            </Stack>
          </Section>

          {/* 6 FEEDBACK */}
          <Section id="feedback" title="6 · Feedback">
            <Stack className="gap-6">
              <Specimen label="Toasts">
                <div className="flex flex-wrap gap-4">
                  <Toast kind="success" title="Results exported" body="CSC401 result file is ready to download." />
                  <Toast kind="error" title="Upload failed" body="Row 2 has a duplicate matric number." />
                </div>
              </Specimen>
              <Specimen label="Banners">
                <Stack className="gap-3">
                  <Banner kind="info">Demo Mode, you're working with sample data. Nothing here is real.</Banner>
                  <Banner kind="success">All 300 scripts have been assigned across you and 2 teaching assistants.</Banner>
                </Stack>
              </Specimen>
              <Specimen label="Offline sync indicator (US-11)">
                <SyncChip />
              </Specimen>
            </Stack>
          </Section>

          {/* 7 OVERLAYS */}
          <Section id="overlays" title="7 · Overlays">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Specimen label="Modal, return with reason">
                <ModalDemo />
              </Specimen>
              <Specimen label="Confirmation, destructive">
                <ConfirmDemo />
              </Specimen>
              <div className="lg:col-span-2">
                <Specimen label="Side panel, script preview">
                  <div className="h-72">
                    <SidePanelDemo />
                  </div>
                </Specimen>
              </div>
            </div>
          </Section>

          {/* 8 PROGRESS */}
          <Section id="progress" title="8 · Progress">
            <Card large>
              <Stack className="gap-8">
                <Specimen label="Stepper, Institution Setup / Demo Mode">
                  <Stepper />
                </Specimen>
                <Specimen label="Progress bars, batch processing & marking">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ProgressBar label="Scan batch processing" value={72} />
                    <ProgressBar label="Dr. Yakubu, marking progress" value={45} />
                  </div>
                </Specimen>
                <Specimen label="Skeleton, matches the table shape">
                  <SkeletonRows />
                </Specimen>
              </Stack>
            </Card>
          </Section>

          {/* 9 STATES */}
          <Section id="states" title="9 · Empty / error / denied">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <EmptyState />
              <ErrorState />
              <DeniedState />
              <EmptyInboxState />
            </div>
          </Section>

          {/* 10 COMPOSITES */}
          <Section id="composites" title="10 · App composites">
            <Stack className="gap-8">
              <Specimen label="Marking interface (US-10), anonymous, mark vs max, autosave">
                <MarkEntryPanel />
              </Specimen>
              <Specimen label="Roster validation report (US-05), officer-only, flawed rows flagged">
                <ValidationReport />
              </Specimen>
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <Specimen label="Moderation compare (US-14)">
                  <ModerationCompare />
                </Specimen>
                <Specimen label="Scan-status list (US-07)">
                  <ScanStatusList />
                </Specimen>
              </div>
            </Stack>
          </Section>
        </div>

        <footer className="mt-16 border-t border-border pt-6 text-[12px] text-muted">
          Built to Markelo Design System v1.0. Tokens mirror Figma variable names for 1:1 translation. Plus Jakarta
          Sans · Tabler icons · flat (no shadows).
        </footer>
      </main>
    </div>
  );
}
