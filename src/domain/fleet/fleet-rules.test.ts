import { describe, expect, it } from "vitest";
import type { Robot } from "#/domain/robot";
import { byAttention, filterRobots, summarizeFleet } from "./fleet-rules";

const NOW = new Date("2026-11-13T12:00:00.000Z");
const FRESH = new Date(NOW.getTime() - 1_000);
const STALE = new Date(NOW.getTime() - 60_000);

const MUNICH = { id: "site-muc", name: "Munich" };
const HAMBURG = { id: "site-ham", name: "Hamburg" };

function buildRobot(overrides: Partial<Robot>): Robot {
	return {
		id: "rb-test",
		name: "Test",
		model: "AMR-200",
		site: MUNICH,
		reportedStatus: "active",
		battery: 80,
		position: { x: 0, y: 0, heading: 0 },
		lastSeenAt: FRESH,
		...overrides,
	};
}

const healthy = buildRobot({ name: "Atlas", battery: 90 });
const erroring = buildRobot({
	name: "Comet",
	reportedStatus: "error",
	battery: 60,
	site: HAMBURG,
});
const offline = buildRobot({ name: "Dash", lastSeenAt: STALE, battery: 40 });
const lowBattery = buildRobot({
	name: "Echo",
	reportedStatus: "idle",
	battery: 5,
});

describe("summarizeFleet", () => {
	it("counts robots by effective status and those needing attention", () => {
		const summary = summarizeFleet(
			[healthy, erroring, offline, lowBattery],
			NOW,
		);

		expect(summary.total).toBe(4);
		expect(summary.byStatus).toEqual({
			active: 1,
			idle: 1,
			charging: 0,
			error: 1,
			offline: 1,
		});
		expect(summary.needsAttention).toBe(3);
		expect(summary.averageBattery).toBe(48.75);
	});

	it("has no average battery for an empty fleet", () => {
		expect(summarizeFleet([], NOW).averageBattery).toBeNull();
	});
});

describe("filterRobots", () => {
	const robots = [healthy, erroring, offline];

	it("returns everything without a filter", () => {
		expect(filterRobots(robots, {}, NOW)).toEqual(robots);
	});

	it("filters by site", () => {
		expect(filterRobots(robots, { siteId: HAMBURG.id }, NOW)).toEqual([
			erroring,
		]);
	});

	it("filters by effective status, so stale robots count as offline", () => {
		expect(filterRobots(robots, { status: "offline" }, NOW)).toEqual([offline]);
		expect(filterRobots(robots, { status: "active" }, NOW)).toEqual([healthy]);
	});
});

describe("byAttention", () => {
	it("sorts by severity, then by name", () => {
		const sorted = [healthy, lowBattery, offline, erroring].sort(
			byAttention(NOW),
		);
		expect(sorted.map((robot) => robot.name)).toEqual([
			"Comet",
			"Dash",
			"Echo",
			"Atlas",
		]);
	});
});
