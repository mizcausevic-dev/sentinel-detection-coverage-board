import type {
  CoverageOptions,
  CoverageReport,
  DetectionStatus,
  Finding,
  SentinelCoverageExport,
  SentinelDetection,
  SentinelWorkspace
} from "./types.js";

const HOUR_MS = 3_600_000;

function emptyStatusCounts(): Record<DetectionStatus, number> {
  return {
    ACTIVE: 0,
    RESOLVED: 0
  };
}

function lastUpdatedAt(detection: SentinelDetection): Date {
  return new Date(detection.updatedAt ?? detection.createdAt);
}

function workspaceHasSource(workspace: SentinelWorkspace, source: string): boolean {
  return workspace.sources.includes(source);
}

export function analyze(input: SentinelCoverageExport, opts: CoverageOptions = {}): CoverageReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleDetectionAfterHours ?? 48) * HOUR_MS;

  const workspaces = input.workspaces ?? [];
  const detections = input.detections ?? [];
  const findingsList: Finding[] = [];
  const detectionsByStatus = emptyStatusCounts();

  const healthyWorkspaces = workspaces.filter((workspace) => workspace.status === "HEALTHY");
  const activeDetections = detections.filter((detection) => detection.status === "ACTIVE");
  const highSeverityDetections = activeDetections.filter((detection) => detection.severity === "high");
  const automationGaps = workspaces.filter((workspace) => workspace.status === "DEGRADED" || !workspace.automationEnabled).length;

  if (healthyWorkspaces.length === 0) {
    findingsList.push({
      code: "no-healthy-workspace",
      severity: "high",
      message: "No healthy Sentinel workspace is active for the captured detection scope.",
      subject: "workspaces"
    });
  }

  for (const workspace of workspaces) {
    if (workspace.status === "DEGRADED") {
      findingsList.push({
        code: "connector-gap",
        severity: "medium",
        message: `Sentinel workspace in ${workspace.scope} is degraded and not carrying healthy connector coverage.`,
        subject: workspace.id,
        subjectName: workspace.owner,
        scope: workspace.scope,
        owner: workspace.owner
      });
    }

    if (workspace.status === "HEALTHY" && !workspaceHasSource(workspace, "IDENTITY")) {
      findingsList.push({
        code: "identity-detection-gap",
        severity: "medium",
        message: `Sentinel workspace in ${workspace.scope} is missing identity detection coverage for Entra and privileged access posture.`,
        subject: workspace.id,
        subjectName: workspace.owner,
        scope: workspace.scope,
        owner: workspace.owner
      });
    }

    if (workspace.status === "HEALTHY" && !workspaceHasSource(workspace, "ENDPOINT")) {
      findingsList.push({
        code: "endpoint-detection-gap",
        severity: "medium",
        message: `Sentinel workspace in ${workspace.scope} is missing endpoint telemetry coverage for device and server detections.`,
        subject: workspace.id,
        subjectName: workspace.owner,
        scope: workspace.scope,
        owner: workspace.owner
      });
    }

    if (!workspace.automationEnabled) {
      findingsList.push({
        code: "playbook-gap",
        severity: "medium",
        message: `Sentinel workspace in ${workspace.scope} is missing healthy incident-playbook automation coverage.`,
        subject: workspace.id,
        subjectName: workspace.owner,
        scope: workspace.scope,
        owner: workspace.owner
      });
    }
  }

  for (const detection of detections) {
    detectionsByStatus[detection.status] += 1;

    if (detection.status !== "ACTIVE") {
      continue;
    }

    if (detection.source === "IDENTITY") {
      findingsList.push({
        code: "identity-detection-gap",
        severity: detection.severity,
        message: `Identity detection coverage around "${detection.asset}" still needs confirmation before the SOC can call posture healthy.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope,
        principal: detection.principal,
        owner: detection.owner
      });
    }

    if (detection.source === "ENDPOINT") {
      findingsList.push({
        code: "endpoint-detection-gap",
        severity: detection.severity,
        message: `Endpoint detection coverage for "${detection.asset}" remains incomplete and needs a tighter containment path.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope,
        owner: detection.owner
      });
    }

    if (detection.source === "CLOUD_APP" || detection.source === "INGESTION") {
      findingsList.push({
        code: "cloud-app-gap",
        severity: detection.severity,
        message: `Connector or cloud-app coverage for "${detection.asset}" remains incomplete and may leave Sentinel blind to incident pivots.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope,
        owner: detection.owner
      });
    }

    if (detection.ruleKind === "Playbook" || detection.ruleKind === "Incident") {
      findingsList.push({
        code: "playbook-gap",
        severity: detection.severity,
        message: `Incident automation around "${detection.asset}" is still missing enough playbook proof for response confidence.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope,
        owner: detection.owner
      });
    }

    if (!detection.owner && detection.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "medium",
        message: `High-severity detection "${detection.title}" still has no assigned owner.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope
      });
    }

    if (now.getTime() - lastUpdatedAt(detection).getTime() > staleAfter) {
      findingsList.push({
        code: "stale-active-detection",
        severity: "medium",
        message: `Detection "${detection.title}" has remained active since ${lastUpdatedAt(detection).toISOString().slice(0, 16)}Z.`,
        subject: detection.id,
        subjectName: detection.asset,
        scope: detection.scope,
        owner: detection.owner
      });
    }
  }

  const staleDetections = activeDetections.filter(
    (detection) => now.getTime() - lastUpdatedAt(detection).getTime() > staleAfter
  ).length;

  return {
    generatedAt: now.toISOString(),
    workspaces: workspaces.length,
    healthyWorkspaces: healthyWorkspaces.length,
    detections: detections.length,
    detectionsByStatus,
    highSeverityDetections: highSeverityDetections.length,
    automationGaps,
    staleDetections,
    findingsList,
    ok: !findingsList.some((finding) => finding.severity === "high")
  };
}
