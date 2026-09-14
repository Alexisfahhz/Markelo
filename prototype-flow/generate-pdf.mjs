import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Markelo — Role-Based Screen Architecture</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 10mm 12mm 10mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1A1A1A;
    background: #FFFFFF;
    font-size: 9pt;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .header {
    border-bottom: 2px solid #1A56A0;
    padding-bottom: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .brand-name {
    font-size: 16pt;
    font-weight: 800;
    color: #0C3D7A;
    letter-spacing: -0.02em;
  }

  .doc-title {
    font-size: 12pt;
    font-weight: 700;
    color: #1A56A0;
    margin-top: 1px;
  }

  .doc-sub {
    font-size: 8pt;
    color: #666666;
    font-weight: 500;
  }

  .meta-block {
    text-align: right;
    font-size: 7.5pt;
    color: #666666;
    line-height: 1.35;
  }

  .meta-block strong {
    color: #1A1A1A;
  }

  h2 {
    font-size: 10pt;
    font-weight: 700;
    color: #0C3D7A;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 3px;
    margin-top: 10px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
    margin-bottom: 10px;
    font-size: 8pt;
  }

  th, td {
    padding: 4px 6px;
    border: 1px solid #E2E8F0;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #F1F5F9;
    color: #0C3D7A;
    font-weight: 700;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tr:nth-child(even) {
    background-color: #F8FAFC;
  }

  .badge {
    display: inline-block;
    padding: 1.5px 6px;
    border-radius: 3px;
    font-size: 7pt;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    white-space: nowrap;
  }

  .badge-mfa {
    background-color: #FEE2E2;
    color: #991B1B;
    border: 1px solid #FCA5A5;
    text-align: center;
  }

  .badge-admin { background-color: #E0E7FF; color: #3730A3; }
  .badge-officer { background-color: #E0F2FE; color: #075985; }
  .badge-lecturer { background-color: #DBEAFE; color: #1E40AF; }
  .badge-ta { background-color: #E0F2FE; color: #0284C7; }
  .badge-mod { background-color: #F3E8FF; color: #6B21A8; }
  .badge-mgmt { background-color: #F1F5F9; color: #334155; }
  .badge-exclusive { background-color: #FEF3C7; color: #92400E; font-weight: 700; border: 1px solid #FCD34D; }

  .role-card {
    border: 1px solid #CBD5E1;
    border-radius: 5px;
    padding: 8px 10px;
    margin-bottom: 8px;
    background: #FFFFFF;
    page-break-inside: avoid;
  }

  .role-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }

  .role-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0C3D7A;
  }

  .role-persona {
    font-size: 8pt;
    color: #64748B;
  }

  .role-job {
    font-size: 8pt;
    font-style: italic;
    color: #334155;
    margin-bottom: 6px;
    padding: 3px 6px;
    background: #F8FAFC;
    border-left: 3px solid #1A56A0;
    border-radius: 2px;
  }

  .screen-group-title {
    font-size: 7.5pt;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: 4px;
    margin-bottom: 2px;
  }

  .screen-list {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 10px;
    font-size: 7.5pt;
  }

  .screen-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #1E293B;
  }

  .screen-num {
    font-weight: 700;
    color: #1A56A0;
    font-size: 7pt;
    min-width: 20px;
  }

  .page-break {
    page-break-before: always;
  }

  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2px;
    margin-bottom: 4px;
    font-size: 6.8pt;
  }

  .matrix-table th {
    text-align: center;
    padding: 2.5px 2px;
    font-size: 6.5pt;
    line-height: 1.1;
  }

  .matrix-table td {
    padding: 1.6px 3px;
    font-size: 6.7pt;
    line-height: 1.15;
  }

  .matrix-table td.center {
    text-align: center;
    font-weight: 700;
  }

  .dot-full { color: #1A56A0; font-size: 7.5pt; }
  .dot-partial { color: #64748B; font-size: 7.5pt; }
  .dot-none { color: #CBD5E1; }

  .callout-box {
    border: 1px solid #BAE6FD;
    background-color: #F0F9FF;
    border-radius: 5px;
    padding: 6px 8px;
    margin-top: 6px;
    margin-bottom: 6px;
    font-size: 7.5pt;
    line-height: 1.35;
  }

  .callout-title {
    font-weight: 700;
    color: #0369A1;
    margin-bottom: 2px;
    font-size: 8pt;
  }

  .footer-note {
    font-size: 6.8pt;
    color: #94A3B8;
    text-align: center;
    margin-top: 10px;
    border-top: 1px solid #E2E8F0;
    padding-top: 4px;
  }
</style>
</head>
<body>

  <!-- ================= PAGE 1 ================= -->
  <div class="header">
    <div class="logo-title">
      <div class="brand-name">Markelo</div>
      <div class="doc-title">Complete Web App Screen Architecture</div>
      <div class="doc-sub">Role-Based Breakdown &amp; Permissions Matrix (56 Screens)</div>
    </div>
    <div class="meta-block">
      <div>Test Institution: <strong>Yaba College of Technology</strong></div>
      <div>Session: <strong>2025/2026 · First Semester</strong></div>
    </div>
  </div>

  <h2>1. User Role Personas &amp; Responsibilities</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Role</th>
        <th style="width: 18%;">Persona</th>
        <th>Primary Responsibility</th>
        <th style="width: 12%; text-align: center;">MFA Required</th>
        <th style="width: 12%; text-align: center;">Total Screens</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-admin">Institution Admin</span></td>
        <td><strong>Mr. Femi Adeyemi</strong></td>
        <td>Get the institution set up and keep the right people in the right roles.</td>
        <td style="text-align: center;"><span class="badge badge-mfa">Mandatory</span></td>
        <td style="text-align: center; font-weight: 700;">23</td>
      </tr>
      <tr>
        <td><span class="badge badge-officer">Exam Officer</span></td>
        <td><strong>Mrs. Adaeze Okonkwo</strong></td>
        <td>Move every exam from scanning to a finalised result without losing a script.</td>
        <td style="text-align: center;">Optional</td>
        <td style="text-align: center; font-weight: 700;">25</td>
      </tr>
      <tr>
        <td><span class="badge badge-lecturer">Lecturer</span></td>
        <td><strong>Dr. Balogun Salami</strong></td>
        <td>Mark my share, split the rest across my TAs, and see where marking stands.</td>
        <td style="text-align: center;">Optional</td>
        <td style="text-align: center; font-weight: 700;">21</td>
      </tr>
      <tr>
        <td style="text-align: left;"><span class="badge badge-ta" style="text-align: left;">Teaching Assistant</span></td>
        <td style="text-align: left;"><strong>Chidinma Eze</strong></td>
        <td style="text-align: left;">Mark the scripts assigned to me, and not lose work when the power goes.</td>
        <td style="text-align: center;">Optional</td>
        <td style="text-align: center; font-weight: 700;">16</td>
      </tr>
      <tr>
        <td><span class="badge badge-mod">Moderator / HOD</span></td>
        <td><strong>Prof. Eze Nwachukwu</strong></td>
        <td>Sample-check marking quality and defend any grade that is disputed.</td>
        <td style="text-align: center;"><span class="badge badge-mfa">Mandatory</span></td>
        <td style="text-align: center; font-weight: 700;">18</td>
      </tr>
      <tr>
        <td><span class="badge badge-mgmt">Senior Management</span></td>
        <td><strong>Prof. R. Adewale (VC)</strong></td>
        <td>See whether exams across the institution are on time and defensible.</td>
        <td style="text-align: center;"><span class="badge badge-mfa">Mandatory</span></td>
        <td style="text-align: center; font-weight: 700;">15</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Role-by-Role Screen Breakdown</h2>

  <!-- ROLE 1: ADMIN -->
  <div class="role-card">
    <div class="role-header">
      <div>
        <span class="role-title">Role 1: Institution Admin</span>
        <span class="role-persona">— Mr. Femi Adeyemi</span>
      </div>
      <div>
        <span class="badge badge-mfa">MFA Required</span>
        <span class="badge badge-admin">23 Screens</span>
      </div>
    </div>
    <div class="role-job">"Get the institution set up and keep the right people in the right roles."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Mandatory)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role (Multi-role switch)</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire (15-min)</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#10</span> Welcome — Institution Admin</li>
      <li class="screen-item"><span class="screen-num">#16</span> Institution details (Admin)</li>
      <li class="screen-item"><span class="screen-num">#17</span> Booklet prompt (Admin)</li>
      <li class="screen-item"><span class="screen-num">#18</span> Invite your team (Admin)</li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#26</span> Dashboard — Institution Admin</li>
      <li class="screen-item"><span class="screen-num">#28</span> <strong>Institution setup (landing)</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#29</span> Courses (Master catalogue)</li>
      <li class="screen-item"><span class="screen-num">#30</span> <strong>People &amp; roles</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#34</span> Booklet profile setup (Master template)</li>
      <li class="screen-item"><span class="screen-num">#35</span> Booklet profile validation</li>
      <li class="screen-item"><span class="screen-num">#36</span> Booklet profile versioning (Lock for print)</li>
      <li class="screen-item"><span class="screen-num">#52</span> Result correction (Audit justification)</li>
      <li class="screen-item"><span class="screen-num">#54</span> Audit trail (Full system audit log)</li>
      <li class="screen-item"><span class="screen-num">#55</span> Help &amp; guidance</li>
      <li class="screen-item"><span class="screen-num">#56</span> Settings (Institution-wide policy)</li>
    </ul>
  </div>

  <!-- ROLE 2: EXAM OFFICER -->
  <div class="role-card">
    <div class="role-header">
      <div>
        <span class="role-title">Role 2: Exam Officer</span>
        <span class="role-persona">— Mrs. Adaeze Okonkwo</span>
      </div>
      <div>
        <span class="badge badge-officer">25 Screens</span>
      </div>
    </div>
    <div class="role-job">"Move every exam from scanning to a finalised result without losing a script."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Optional)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#11</span> Welcome — Exam Officer</li>
      <li class="screen-item"><span class="screen-num">#19</span> <strong>First-run empty dashboard</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#22</span> Dashboard — Exam Officer</li>
      <li class="screen-item"><span class="screen-num">#31</span> <strong>Exam creation</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#32</span> Marking scheme setup (Ingestion)</li>
      <li class="screen-item"><span class="screen-num">#33</span> <strong>Student data upload &amp; validation</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#34</span> Booklet profile setup (Exam assignment)</li>
      <li class="screen-item"><span class="screen-num">#35</span> Booklet profile validation</li>
      <li class="screen-item"><span class="screen-num">#36</span> Booklet profile versioning</li>
      <li class="screen-item"><span class="screen-num">#37</span> <strong>Scan batch upload</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#38</span> <strong>AI processing &amp; integrity report</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#39</span> <strong>Exception queue</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#40</span> <strong>Exception resolve (detail view)</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#41</span> <strong>Identity registry</strong> (Vault) <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#45</span> Marking progress (Exam-wide pacing)</li>
      <li class="screen-item"><span class="screen-num">#50</span> <strong>Result processing &amp; export</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#51</span> Result approval (Submission to Senate)</li>
    </ul>
  </div>

  <div class="footer-note">Page 1 of 3</div>

  <!-- ================= PAGE 2 ================= -->
  <div class="page-break"></div>

  <!-- ROLE 3: LECTURER -->
  <div class="role-card">
    <div class="role-header">
      <div>
        <span class="role-title">Role 3: Lecturer</span>
        <span class="role-persona">— Dr. Balogun Salami</span>
      </div>
      <div>
        <span class="badge badge-lecturer">21 Screens</span>
      </div>
    </div>
    <div class="role-job">"Mark my share, split the rest across my TAs, and see where marking stands."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Optional)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#12</span> Welcome — Lecturer</li>
      <li class="screen-item"><span class="screen-num">#20</span> Marker anonymity explainer</li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#23</span> Dashboard — Lecturer</li>
      <li class="screen-item"><span class="screen-num">#29</span> Courses (Course details)</li>
      <li class="screen-item"><span class="screen-num">#32</span> Marking scheme setup (Rubric &amp; model answers)</li>
      <li class="screen-item"><span class="screen-num">#42</span> Marking interface (Script ID only, offline cache)</li>
      <li class="screen-item"><span class="screen-num">#43</span> Answer viewer (Full response inspection)</li>
      <li class="screen-item"><span class="screen-num">#44</span> <strong>Marking assignment</strong> (TA split) <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#45</span> Marking progress (Team breakdown)</li>
      <li class="screen-item"><span class="screen-num">#46</span> <strong>My courses</strong> <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#47</span> Flagged for review (Review TA escalations)</li>
      <li class="screen-item"><span class="screen-num">#49</span> Returned scripts (Review Moderator returns)</li>
      <li class="screen-item"><span class="screen-num">#56</span> Settings (User preferences)</li>
    </ul>
  </div>

  <!-- ROLE 4: TEACHING ASSISTANT -->
  <div class="role-card" style="text-align: left;">
    <div class="role-header" style="text-align: left;">
      <div style="text-align: left;">
        <span class="role-title" style="text-align: left;">Role 4: Teaching Assistant (TA)</span>
        <span class="role-persona" style="text-align: left;">— Chidinma Eze</span>
      </div>
      <div style="text-align: left;">
        <span class="badge badge-ta" style="text-align: left;">16 Screens</span>
      </div>
    </div>
    <div class="role-job" style="text-align: left;">"Mark the scripts assigned to me, and not lose work when the power goes."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Optional)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#13</span> Welcome — Teaching Assistant</li>
      <li class="screen-item"><span class="screen-num">#20</span> Marker anonymity explainer</li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#24</span> Dashboard — Teaching Assistant (Quota &amp; pace)</li>
      <li class="screen-item"><span class="screen-num">#42</span> Marking interface (Assigned scripts only)</li>
      <li class="screen-item"><span class="screen-num">#43</span> Answer viewer</li>
      <li class="screen-item"><span class="screen-num">#45</span> Marking progress ("Your pace" view only)</li>
      <li class="screen-item"><span class="screen-num">#47</span> Flagged for review (Flag question to Lecturer)</li>
      <li class="screen-item"><span class="screen-num">#56</span> Settings (Offline cache preferences)</li>
    </ul>
  </div>

  <!-- ROLE 5: MODERATOR / HOD -->
  <div class="role-card">
    <div class="role-header">
      <div>
        <span class="role-title">Role 5: Moderator / Head of Department (HOD)</span>
        <span class="role-persona">— Prof. Eze Nwachukwu</span>
      </div>
      <div>
        <span class="badge badge-mfa">MFA Required</span>
        <span class="badge badge-mod">18 Screens</span>
      </div>
    </div>
    <div class="role-job">"Sample-check marking quality and be able to defend any grade that is disputed."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Mandatory)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#14</span> Welcome — Moderator / HOD</li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#25</span> Dashboard — Moderator / HOD (Queue volume)</li>
      <li class="screen-item"><span class="screen-num">#43</span> Answer viewer (Full script audit)</li>
      <li class="screen-item"><span class="screen-num">#48</span> <strong>Moderation workspace</strong> (Side-by-side) <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#49</span> Returned scripts (Return with written reason)</li>
      <li class="screen-item"><span class="screen-num">#51</span> Result approval (Grade curves &amp; sign-off)</li>
      <li class="screen-item"><span class="screen-num">#52</span> Result correction (Authorize petitions)</li>
      <li class="screen-item"><span class="screen-num">#54</span> Audit trail (Verify examiner actions)</li>
      <li class="screen-item"><span class="screen-num">#55</span> Help &amp; guidance</li>
      <li class="screen-item"><span class="screen-num">#56</span> Settings</li>
    </ul>
  </div>

  <!-- ROLE 6: SENIOR MANAGEMENT -->
  <div class="role-card">
    <div class="role-header">
      <div>
        <span class="role-title">Role 6: Senior Management</span>
        <span class="role-persona">— Prof. R. Adewale, VC's Office</span>
      </div>
      <div>
        <span class="badge badge-mfa">MFA Required</span>
        <span class="badge badge-mgmt">15 Screens</span>
      </div>
    </div>
    <div class="role-job">"See whether exams across the institution are on time and defensible."</div>
    <ul class="screen-list">
      <li class="screen-item"><span class="screen-num">#1</span> Sign in</li>
      <li class="screen-item"><span class="screen-num">#2</span> MFA check (Mandatory)</li>
      <li class="screen-item"><span class="screen-num">#3</span> Accept invitation</li>
      <li class="screen-item"><span class="screen-num">#4</span> Forgot password</li>
      <li class="screen-item"><span class="screen-num">#7</span> Choose role</li>
      <li class="screen-item"><span class="screen-num">#8</span> Session about to expire</li>
      <li class="screen-item"><span class="screen-num">#9</span> Access revoked mid-session</li>
      <li class="screen-item"><span class="screen-num">#15</span> Welcome — Senior Management</li>
      <li class="screen-item"><span class="screen-num">#21</span> Onboarding done</li>
      <li class="screen-item"><span class="screen-num">#27</span> Dashboard — Senior Management</li>
      <li class="screen-item"><span class="screen-num">#50</span> Result processing &amp; export (Senate summaries)</li>
      <li class="screen-item"><span class="screen-num">#53</span> <strong>Exam performance</strong> (KPIs) <span class="badge badge-exclusive">Exclusive</span></li>
      <li class="screen-item"><span class="screen-num">#54</span> Audit trail (Institutional compliance)</li>
      <li class="screen-item"><span class="screen-num">#55</span> Help &amp; guidance</li>
      <li class="screen-item"><span class="screen-num">#56</span> Settings</li>
    </ul>
  </div>

  <div class="callout-box">
    <div class="callout-title">Universal System &amp; Security States (Screens 5 &amp; 6)</div>
    These screens handle unauthenticated or suspended accounts across all roles:
    <strong>#5 No role assigned</strong> (authenticated user awaiting invitation) and
    <strong>#6 Account suspended</strong> (access deactivated by Institution Admin).
  </div>

  <div class="footer-note">Page 2 of 3</div>

  <!-- ================= PAGE 3 ================= -->
  <div class="page-break"></div>

  <h2>3. Complete 56-Screen Cross-Role Permissions Matrix</h2>
  <p style="font-size: 7.5pt; color: #64748B; margin-bottom: 3px;">
    <strong>Legend:</strong>
    <span class="dot-full">●</span> Primary / Direct Access &nbsp;|&nbsp;
    <span class="dot-partial">○</span> Secondary / View / Shared Access &nbsp;|&nbsp;
    <span class="dot-none">–</span> Restricted (Hidden / Locked)
  </p>

  <table class="matrix-table">
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">#</th>
        <th style="width: 33%;">Screen Name</th>
        <th style="width: 14%;">Flow Category</th>
        <th style="width: 8%;">Admin</th>
        <th style="width: 8%;">Officer</th>
        <th style="width: 8%;">Lecturer</th>
        <th style="width: 8%;">TA</th>
        <th style="width: 8%;">Moderator</th>
        <th style="width: 8%;">Mgmt</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="center">1</td><td>Sign in</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">2</td><td>MFA check</td><td>Auth</td><td class="center dot-full">●*</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td><td class="center dot-full">●*</td><td class="center dot-full">●*</td></tr>
      <tr><td class="center">3</td><td>Accept invitation</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">4</td><td>Forgot password</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">5</td><td>No role assigned</td><td>Auth</td><td class="center dot-partial" colspan="6">Shared System State (Unassigned authenticated users)</td></tr>
      <tr><td class="center">6</td><td>Account suspended</td><td>Auth</td><td class="center dot-partial" colspan="6">Shared System State (Deactivated institutional accounts)</td></tr>
      <tr><td class="center">7</td><td>Choose role (multi-role switch)</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">8</td><td>Session about to expire</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">9</td><td>Access revoked mid-session</td><td>Auth</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">10</td><td>Welcome — Institution Admin</td><td>Onboarding</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">11</td><td>Welcome — Exam Officer</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">12</td><td>Welcome — Lecturer</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">13</td><td>Welcome — Teaching Assistant</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">14</td><td>Welcome — Moderator/HOD</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">15</td><td>Welcome — Senior Management</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">16</td><td>Institution details (Admin)</td><td>Onboarding</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">17</td><td>Booklet prompt (Admin)</td><td>Onboarding</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">18</td><td>Invite your team (Admin)</td><td>Onboarding</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">19</td><td>First-run empty dashboard</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">20</td><td>Marker anonymity explainer</td><td>Onboarding</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">21</td><td>Onboarding done</td><td>Onboarding</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">22</td><td>Dashboard — Exam Officer</td><td>Dashboards</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">23</td><td>Dashboard — Lecturer</td><td>Dashboards</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">24</td><td>Dashboard — Teaching Assistant</td><td>Dashboards</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">25</td><td>Dashboard — Moderator/HOD</td><td>Dashboards</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">26</td><td>Dashboard — Institution Admin</td><td>Dashboards</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">27</td><td>Dashboard — Senior Management</td><td>Dashboards</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">28</td><td>Institution setup (landing)</td><td>Institution</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">29</td><td>Courses</td><td>Institution</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">30</td><td>People &amp; roles</td><td>Institution</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">31</td><td>Exam creation</td><td>Exam setup</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">32</td><td>Marking scheme setup</td><td>Exam setup</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">33</td><td>Student data upload &amp; validation</td><td>Exam setup</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">34</td><td>Booklet profile setup</td><td>Exam setup</td><td class="center dot-full">●</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">35</td><td>Booklet profile validation</td><td>Exam setup</td><td class="center dot-full">●</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">36</td><td>Booklet profile versioning</td><td>Exam setup</td><td class="center dot-full">●</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">37</td><td>Scan batch upload</td><td>Scripts</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">38</td><td>AI processing &amp; integrity report</td><td>Scripts</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">39</td><td>Exception queue</td><td>Scripts</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">40</td><td>Exception resolve (detail view)</td><td>Scripts</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">41</td><td>Identity registry</td><td>Scripts</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">42</td><td>Marking interface</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">43</td><td>Answer viewer</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-partial">○</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">44</td><td>Marking assignment</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">45</td><td>Marking progress</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-full">●</td><td class="center dot-full">●*</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">46</td><td>My courses</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">47</td><td>Flagged for review</td><td>Marking</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">48</td><td>Moderation workspace</td><td>Moderation</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">49</td><td>Returned scripts</td><td>Moderation</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">50</td><td>Result processing &amp; export</td><td>Results</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-partial">○</td></tr>
      <tr><td class="center">51</td><td>Result approval</td><td>Results</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">52</td><td>Result correction</td><td>Results</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-partial">○</td><td class="center dot-none">–</td></tr>
      <tr><td class="center">53</td><td>Exam performance</td><td>Oversight</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">54</td><td>Audit trail</td><td>Oversight</td><td class="center dot-full">●</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-none">–</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">55</td><td>Help &amp; guidance</td><td>Support</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td><td class="center dot-full">●</td></tr>
      <tr><td class="center">56</td><td>Settings</td><td>Support</td><td class="center dot-full">●*</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td><td class="center dot-partial">○</td></tr>
    </tbody>
  </table>

  <div class="footer-note">Page 3 of 3</div>

</body>
</html>`;

async function main() {
  const htmlPath = path.resolve("screen-list.html");
  fs.writeFileSync(htmlPath, htmlContent, "utf-8");
  console.log("HTML written to " + htmlPath);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "load" });
  console.log("Page loaded in headless browser");

  const rootDest = "/Users/macintosh/Desktop/Projects/Markelo/Markelo_Role_Based_Screen_List.pdf";
  const docsDest = "/Users/macintosh/Desktop/Projects/Markelo/Docs/Markelo_Role_Based_Screen_List.pdf";
  const artifactDest = "/Users/macintosh/.gemini/antigravity-ide/brain/b43d0095-67cb-417f-8abc-312d53d1eaf2/Markelo_Role_Based_Screen_List.pdf";

  await page.pdf({
    path: rootDest,
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      right: "10mm",
      bottom: "10mm",
      left: "10mm",
    },
  });

  // Copy to Docs and Artifacts directory
  fs.copyFileSync(rootDest, docsDest);
  fs.copyFileSync(rootDest, artifactDest);

  await browser.close();
  console.log("PDF successfully generated at:");
  console.log("1. " + rootDest);
  console.log("2. " + docsDest);
  console.log("3. " + artifactDest);
}

main().catch((err) => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});

