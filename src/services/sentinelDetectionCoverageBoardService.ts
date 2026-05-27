// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { detectionLanePackets, incidentPackets, sampleSentinelCoveragePayload } from "../data/sampleSentinelCoverage.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleSentinelCoveragePayload, {
  now: NOW,
  staleDetectionAfterHours: 36
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    workspaces: report.workspaces,
    healthyWorkspaces: report.healthyWorkspaces,
    detections: report.detections,
    highSeverityDetections: report.highSeverityDetections,
    automationGaps: report.automationGaps,
    staleDetections: report.staleDetections,
    recommendation:
      "Restore workspace ingestion, close privileged identity coverage gaps, repair collaboration telemetry, and stabilize playbook automation before calling Sentinel detection posture healthy."
  };
}

export function detectionLane() {
  return detectionLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "identity-lane") {
        return finding.code === "identity-detection-gap" || finding.code === "high-severity-unassigned";
      }
      if (lane.id === "endpoint-lane") {
        return finding.code === "endpoint-detection-gap" || finding.code === "stale-active-detection";
      }
      if (lane.id === "collab-lane") {
        return finding.code === "cloud-app-gap" || finding.code === "connector-gap";
      }
      if (lane.id === "automation-lane") {
        return finding.code === "playbook-gap" || finding.code === "stale-active-detection";
      }
      return false;
    }).length
  }));
}

export function coverageGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "identity-detection-gap"
          ? "Identity Detection Engineering"
          : finding.code === "endpoint-detection-gap"
            ? "Security Platform"
            : finding.code === "cloud-app-gap"
              ? "Collaboration Detection Engineering"
              : "Incident Automation")
    }));
}

export function incidentPosture() {
  return incidentPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline Sentinel coverage analyzer and CLI, not static copy alone.",
    "Workspaces and detections are synthetic sample data only; no live Sentinel workspace tokens, customer events, or production incidents are published.",
    "The control plane keeps ingestion, rule coverage, automation, and incident posture visible for Microsoft security stakeholders.",
    "This surface demonstrates Microsoft Sentinel detection coverage, not a generic cloud keyword page.",
    "It complements Defender, Entra, Intune, M365 retention, AWS security, and GCP proof with a concrete Sentinel posture lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    detectionLane: detectionLane(),
    coverageGaps: coverageGaps(),
    incidentPosture: incidentPosture(),
    verification: verification(),
    sample: sampleSentinelCoveragePayload
  };
}
