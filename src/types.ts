// Operator surface for Microsoft Sentinel detection coverage.
//
// Inputs reflect synthetic exports or captured snapshots for:
//   - workspace and connector health
//   - analytics rules, incidents, and automation coverage

export type WorkspaceStatus = "HEALTHY" | "DEGRADED";
export type DetectionStatus = "ACTIVE" | "RESOLVED";
export type DetectionSeverity = "high" | "medium" | "low" | "info";
export type RuleKind = "AnalyticsRule" | "Connector" | "Playbook" | "Workspace" | "Incident" | string;
export type CoverageSource = "INGESTION" | "IDENTITY" | "ENDPOINT" | "CLOUD_APP" | "THREAT_INTEL" | string;

export interface SentinelWorkspace {
  id: string;
  subscriptionId: string;
  scope: string;
  status: WorkspaceStatus;
  sources: CoverageSource[];
  owner: string;
  automationEnabled: boolean;
}

export interface SentinelDetection {
  id: string;
  category: string;
  title: string;
  scope: string;
  severity: DetectionSeverity;
  status: DetectionStatus;
  ruleKind: RuleKind;
  asset: string;
  principal?: string;
  source?: CoverageSource;
  createdAt: string;
  updatedAt?: string;
  owner?: string;
  note?: string;
}

export interface SentinelCoverageExport {
  workspaces?: SentinelWorkspace[];
  detections?: SentinelDetection[];
}

export type DetectionCode =
  | "no-healthy-workspace"
  | "connector-gap"
  | "identity-detection-gap"
  | "endpoint-detection-gap"
  | "cloud-app-gap"
  | "playbook-gap"
  | "high-severity-unassigned"
  | "stale-active-detection";

export interface Finding {
  code: DetectionCode;
  severity: DetectionSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: string;
  principal?: string;
  owner?: string;
}

export interface CoverageReport {
  generatedAt: string;
  workspaces: number;
  healthyWorkspaces: number;
  detections: number;
  detectionsByStatus: Record<DetectionStatus, number>;
  highSeverityDetections: number;
  automationGaps: number;
  staleDetections: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface CoverageOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}
