import type { SentinelCoverageExport } from "../types.js";

export const sampleSentinelCoveragePayload: SentinelCoverageExport = {
  workspaces: [
    {
      id: "ws-core-prod",
      subscriptionId: "sub-prod-001",
      scope: "Global SOC workspace",
      status: "HEALTHY",
      sources: ["INGESTION", "IDENTITY", "ENDPOINT", "THREAT_INTEL"],
      owner: "Security Platform",
      automationEnabled: true
    },
    {
      id: "ws-emea-collab",
      subscriptionId: "sub-emea-014",
      scope: "EMEA collaboration workspace",
      status: "DEGRADED",
      sources: ["IDENTITY", "CLOUD_APP"],
      owner: "Collaboration Detection Engineering",
      automationEnabled: false
    }
  ],
  detections: [
    {
      id: "sn-001",
      category: "Identity",
      title: "Privileged access anomaly detection is missing a current owner",
      scope: "Global SOC workspace",
      severity: "high",
      status: "ACTIVE",
      ruleKind: "AnalyticsRule",
      asset: "Privileged access analytics",
      principal: "global-admins@kineticgain.com",
      source: "IDENTITY",
      createdAt: "2026-05-26T09:10:00Z",
      updatedAt: "2026-05-26T10:35:00Z",
      owner: "Identity Detection Engineering",
      note: "Reconcile analytics tuning before the next admin review window."
    },
    {
      id: "sn-002",
      category: "Endpoint",
      title: "Server telemetry connector drift on finance reporting nodes",
      scope: "Global SOC workspace",
      severity: "medium",
      status: "ACTIVE",
      ruleKind: "Connector",
      asset: "Defender for Endpoint connector",
      source: "ENDPOINT",
      createdAt: "2026-05-25T20:15:00Z",
      updatedAt: "2026-05-25T21:00:00Z",
      owner: "Security Platform",
      note: "Restore connector health before the next reporting cycle."
    },
    {
      id: "sn-003",
      category: "Cloud app",
      title: "Collaboration app connector is not ingesting enough audit events",
      scope: "EMEA collaboration workspace",
      severity: "medium",
      status: "ACTIVE",
      ruleKind: "Connector",
      asset: "M365 audit connector",
      source: "CLOUD_APP",
      createdAt: "2026-05-24T22:00:00Z",
      updatedAt: "2026-05-24T22:40:00Z",
      owner: "Collaboration Detection Engineering",
      note: "Restore M365 event flow and confirm mailbox rule coverage."
    },
    {
      id: "sn-004",
      category: "Automation",
      title: "Incident playbook is incomplete for high-confidence phishing incidents",
      scope: "EMEA collaboration workspace",
      severity: "high",
      status: "ACTIVE",
      ruleKind: "Playbook",
      asset: "Phishing incident playbook",
      source: "INGESTION",
      createdAt: "2026-05-24T08:30:00Z",
      updatedAt: "2026-05-24T09:15:00Z",
      owner: "Incident Automation",
      note: "Resolve playbook drift before broad user campaigns resume."
    },
    {
      id: "sn-005",
      category: "Threat intel",
      title: "Threat-intel correlation rule remains active without verified closure",
      scope: "Global SOC workspace",
      severity: "high",
      status: "ACTIVE",
      ruleKind: "Incident",
      asset: "TI correlation incident queue",
      source: "THREAT_INTEL",
      createdAt: "2026-05-23T12:00:00Z",
      updatedAt: "2026-05-23T12:20:00Z",
      note: "Incident queue still lacks final ownership proof."
    },
    {
      id: "sn-006",
      category: "Identity",
      title: "Legacy guest anomaly replay reviewed and closed",
      scope: "EMEA collaboration workspace",
      severity: "low",
      status: "RESOLVED",
      ruleKind: "AnalyticsRule",
      asset: "Guest access anomaly",
      principal: "legacy-guest#EXT#@kineticgain.onmicrosoft.com",
      source: "IDENTITY",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-21T08:00:00Z",
      owner: "Identity Detection Engineering"
    }
  ]
};

export const detectionLanePackets = [
  {
    id: "identity-lane",
    lane: "Identity detection lane",
    owner: "Identity Detection Engineering",
    focus: "Privileged access detections, anomaly coverage, and rule ownership.",
    status: "red",
    note: "Identity analytics still carry unresolved coverage and owner pressure.",
    nextAction: "Reconcile analytics tuning and privileged access ownership before the next admin review window."
  },
  {
    id: "endpoint-lane",
    lane: "Endpoint coverage lane",
    owner: "Security Platform",
    focus: "Connector health, server telemetry, and endpoint evidence completeness.",
    status: "yellow",
    note: "Endpoint coverage is recoverable, but connector drift is still blocking full trust.",
    nextAction: "Restore endpoint connector health and verify finance node telemetry."
  },
  {
    id: "collab-lane",
    lane: "Collaboration detection lane",
    owner: "Collaboration Detection Engineering",
    focus: "M365 audit events, mailbox detections, and cloud-app visibility.",
    status: "red",
    note: "Collaboration event flow is degraded and detection coverage is incomplete.",
    nextAction: "Repair audit ingestion and confirm collaboration detections before external campaigns expand."
  },
  {
    id: "automation-lane",
    lane: "Incident automation lane",
    owner: "Incident Automation",
    focus: "Playbook readiness, incident closure evidence, and response confidence.",
    status: "red",
    note: "Playbook drift and incident-closure proof are still below the desired bar.",
    nextAction: "Repair incident playbook execution and close the stale TI queue."
  }
];

export const incidentPackets = [
  {
    packetId: "SN-11",
    lane: "Privileged access tuning packet",
    owner: "Identity Detection Engineering",
    completenessScore: 67,
    status: "red",
    blocker: "Privileged access anomaly coverage is still missing final owner approval.",
    launchWindowHours: 6,
    decisionNote: "Do not wait for the weekly governance review before tightening privileged identity detections."
  },
  {
    packetId: "SN-18",
    lane: "Endpoint connector recovery packet",
    owner: "Security Platform",
    completenessScore: 81,
    status: "yellow",
    blocker: "Finance-server telemetry is partially restored, but connector proof is not complete yet.",
    launchWindowHours: 10,
    decisionNote: "Connector recovery can clear once the endpoint evidence lands in the workspace."
  },
  {
    packetId: "SN-24",
    lane: "Collaboration ingestion packet",
    owner: "Collaboration Detection Engineering",
    completenessScore: 59,
    status: "red",
    blocker: "M365 audit connector flow is still inconsistent across the EMEA tenant.",
    launchWindowHours: 8,
    decisionNote: "Hold broader collaboration rollout until audit ingestion is healthy again."
  },
  {
    packetId: "SN-31",
    lane: "Incident playbook packet",
    owner: "Incident Automation",
    completenessScore: 73,
    status: "red",
    blocker: "High-confidence phishing playbook drift is still unresolved in the response queue.",
    launchWindowHours: 4,
    decisionNote: "Repair incident automation before more high-confidence detections queue without closure proof."
  }
];
