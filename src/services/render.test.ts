// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { renderCoverageGaps, renderDocs, renderOverview } from "./render.js";

describe("render", () => {
  test("overview includes Sentinel framing", () => {
    expect(renderOverview()).toContain("Sentinel Detection Coverage Board");
    expect(renderOverview()).toContain("connector health");
  });

  test("docs and gap routes use the new route names", () => {
    expect(renderDocs()).toContain("/detection-lane");
    expect(renderDocs()).toContain("sentinel-detection-coverage");
    expect(renderCoverageGaps()).toContain("Coverage Gaps");
  });
});
