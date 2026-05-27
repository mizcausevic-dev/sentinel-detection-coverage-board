# Changelog

## v0.1-shipped - 2026-05-27

- Shipped `sentinel-detection-coverage-board` as a public Microsoft Sentinel detection-coverage operator surface.
- Added overview, `detection-lane`, `coverage-gaps`, `incident-posture`, `verification`, and `docs` routes.
- Added prerendered GitHub Pages packaging for `sentinel.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added a reusable offline analyzer plus CLI for synthetic Sentinel workspace and detection exports.
- Added README proof screenshots and the `docs/KINETIC_GAIN_EMBEDDED.md` tie-back file.

## Initial release notes

- Initial release: operator surface for Microsoft Sentinel workspace health, connector coverage, analytics rules, and incident automation posture.
- CLI: `sentinel-detection-coverage <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-detection-after-hours N`, `--fail-on-high`, `--out FILE`.
- Cloud security and device-governance lane (Wave 13) — extends the Microsoft track from Defender, Entra, Intune, and M365 proof into Sentinel detection coverage.
