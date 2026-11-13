import { describe, expect, it } from "vitest";
import {
	getAttentionReasons,
	getBatteryLevel,
	getEffectiveStatus,
	isStale,
	STALE_AFTER_MS,
} from "./robot-health";
import type { Robot } from "./types";

const NOW = new Date("2026-11-13T12:00:00.000Z");

function secondsAgo(seconds: number): Date {
	return new Date(NOW.getTime() - seconds * 1_000);
}

function buildRobot(overrides: Partial<Robot> = {}): Robot {
	return {
		id: "rb-test",
		name: "Test",
		model: "AMR-200",
		siteName: "Test Site",
		reportedStatus: "active",
		battery: 80,
		position: { x: 0, y: 0, heading: 0 },
		lastSeenAt: secondsAgo(1),
		...overrides,
	};
}

describe("getBatteryLevel", () => {
	it.each([
		[100, "ok"],
		[21, "ok"],
		[20, "low"],
		[11, "low"],
		[10, "critical"],
		[0, "critical"],
	] as const)("classifies %s%% as %s", (battery, expected) => {
		expect(getBatteryLevel(battery)).toBe(expected);
	});
});

describe("isStale", () => {
	it("is fresh up to and including the threshold", () => {
		const atThreshold = new Date(NOW.getTime() - STALE_AFTER_MS);
		expect(isStale(atThreshold, NOW)).toBe(false);
	});

	it("is stale once the threshold is exceeded", () => {
		const pastThreshold = new Date(NOW.getTime() - STALE_AFTER_MS - 1);
		expect(isStale(pastThreshold, NOW)).toBe(true);
	});
});

describe("getEffectiveStatus", () => {
	it("uses the reported status while telemetry is fresh", () => {
		const robot = buildRobot({ reportedStatus: "charging" });
		expect(getEffectiveStatus(robot, NOW)).toBe("charging");
	});

	it("is offline once telemetry is stale, whatever was reported last", () => {
		const robot = buildRobot({
			reportedStatus: "active",
			lastSeenAt: secondsAgo(60),
		});
		expect(getEffectiveStatus(robot, NOW)).toBe("offline");
	});
});

describe("getAttentionReasons", () => {
	it("is empty for a healthy robot", () => {
		expect(getAttentionReasons(buildRobot(), NOW)).toEqual([]);
	});

	it("flags a reported error", () => {
		const robot = buildRobot({ reportedStatus: "error" });
		expect(getAttentionReasons(robot, NOW)).toEqual(["error"]);
	});

	it("flags stale telemetry as offline instead of the last reported error", () => {
		const robot = buildRobot({
			reportedStatus: "error",
			lastSeenAt: secondsAgo(60),
		});
		expect(getAttentionReasons(robot, NOW)).toEqual(["offline"]);
	});

	it("flags a critical battery when the robot is not charging", () => {
		const robot = buildRobot({ reportedStatus: "idle", battery: 6 });
		expect(getAttentionReasons(robot, NOW)).toEqual(["battery-critical"]);
	});

	it("does not flag a critical battery while charging", () => {
		const robot = buildRobot({ reportedStatus: "charging", battery: 6 });
		expect(getAttentionReasons(robot, NOW)).toEqual([]);
	});

	it("does not flag a low but not critical battery", () => {
		const robot = buildRobot({ battery: 15 });
		expect(getAttentionReasons(robot, NOW)).toEqual([]);
	});

	it("lists multiple reasons in order of severity", () => {
		const robot = buildRobot({ reportedStatus: "error", battery: 5 });
		expect(getAttentionReasons(robot, NOW)).toEqual([
			"error",
			"battery-critical",
		]);
	});
});
