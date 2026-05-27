import { coverageGaps, detectionLane, summary } from "../src/services/sentinelDetectionCoverageBoardService.js";

console.log("sentinel-detection-coverage-board demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    detectionLane().map((lane) => ({
      lane: lane.lane,
      owner: lane.owner,
      status: lane.status
    })),
    null,
    2
  )
);
console.log(JSON.stringify(coverageGaps().slice(0, 3), null, 2));
