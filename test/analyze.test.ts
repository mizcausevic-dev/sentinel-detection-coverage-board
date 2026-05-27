import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { SentinelCoverageExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): SentinelCoverageExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as SentinelCoverageExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts workspaces and detections", () => {
    const report = analyze(fixture("sentinel-coverage.json"), { now: NOW });
    expect(report.workspaces).toBe(2);
    expect(report.healthyWorkspaces).toBe(1);
    expect(report.detections).toBe(6);
  });

  it("flags missing healthy workspaces as high", () => {
    const report = analyze({ workspaces: [], detections: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-healthy-workspace")?.severity).toBe("high");
  });

  it("flags connector degradation", () => {
    const report = analyze(fixture("sentinel-coverage.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "connector-gap")?.scope).toBe("EMEA collaboration workspace");
  });

  it("flags identity, endpoint, cloud app, and playbook gaps", () => {
    const report = analyze(fixture("sentinel-coverage.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "identity-detection-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "endpoint-detection-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "cloud-app-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "playbook-gap")).toBeDefined();
  });

  it("flags stale active detections", () => {
    const report = analyze(fixture("sentinel-coverage.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-active-detection")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("sentinel-coverage-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("sentinel-coverage.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("sentinel-coverage.json"), { now: NOW }));
    expect(summary).toMatch(/workspaces/);
    expect(summary).toMatch(/detections/);
  });
});
