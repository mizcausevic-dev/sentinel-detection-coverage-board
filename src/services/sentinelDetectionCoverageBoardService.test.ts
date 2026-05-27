// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  coverageGaps,
  detectionLane,
  incidentPosture,
  payload,
  summary,
  verification
} from "./sentinelDetectionCoverageBoardService.js";

describe("sentinelDetectionCoverageBoardService", () => {
  test("summary reflects the sample Sentinel posture", () => {
    expect(summary()).toMatchObject({
      workspaces: 2,
      healthyWorkspaces: 1,
      detections: 6,
      highSeverityDetections: 3
    });
    expect(summary().automationGaps).toBeGreaterThanOrEqual(1);
  });

  test("detection lane stays mapped to owners", () => {
    const lanes = detectionLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Identity detection lane" && lane.owner === "Identity Detection Engineering")).toBe(true);
  });

  test("coverage gaps sort high severity first", () => {
    const gaps = coverageGaps();
    expect(gaps[0]?.severity).toBe("high");
    expect(gaps.some((gap) => gap.code === "identity-detection-gap")).toBe(true);
  });

  test("incident posture and verification stay populated", () => {
    expect(incidentPosture()).toHaveLength(4);
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
