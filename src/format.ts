import type { CoverageReport, DetectionSeverity } from "./types.js";

const SEVERITY_LABEL: Record<DetectionSeverity, string> = {
  high: "🔴 high",
  medium: "🟠 medium",
  low: "🟡 low",
  info: "ℹ️ info"
};

const SEVERITY_RANK: Record<DetectionSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
  info: 3
};

export function toMarkdown(report: CoverageReport): string {
  const lines: string[] = [];
  lines.push(report.ok ? "# Microsoft Sentinel detection posture ✅" : "# Microsoft Sentinel detection posture ❌");
  lines.push("");
  lines.push(`Generated: \`${report.generatedAt}\``);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push(`- Workspaces: **${report.workspaces}**`);
  lines.push(`- Healthy workspaces: **${report.healthyWorkspaces}**`);
  lines.push(`- Detections: **${report.detections}**`);
  lines.push(`- High-severity detections: **${report.highSeverityDetections}**`);
  lines.push(`- Automation gaps: **${report.automationGaps}**`);
  lines.push(`- Stale active detections: **${report.staleDetections}**`);
  lines.push("");
  lines.push("## Detections by status");
  lines.push("");
  lines.push("| ACTIVE | RESOLVED |");
  lines.push("|---:|---:|");
  lines.push(`| ${report.detectionsByStatus.ACTIVE} | ${report.detectionsByStatus.RESOLVED} |`);

  const ranked = [...report.findingsList].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  if (ranked.length > 0) {
    lines.push("");
    lines.push(`## Findings (${ranked.length})`);
    lines.push("");
    lines.push("| severity | code | subject | message |");
    lines.push("|---|---|---|---|");
    for (const finding of ranked) {
      lines.push(
        `| ${SEVERITY_LABEL[finding.severity]} | \`${finding.code}\` | ${finding.subjectName ?? finding.subject} | ${finding.message} |`
      );
    }
  } else {
    lines.push("");
    lines.push("No findings.");
  }
  return lines.join("\n");
}

export function toSummary(report: CoverageReport): string {
  const counts: Record<DetectionSeverity, number> = { high: 0, medium: 0, low: 0, info: 0 };
  for (const finding of report.findingsList) counts[finding.severity] += 1;
  return `${report.workspaces} workspaces · ${report.detections} detections · ${counts.high} high · ${counts.medium} medium (${report.ok ? "ok" : "fail"})`;
}
