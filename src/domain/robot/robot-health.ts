import type { Robot, RobotStatus } from "./types";

export const BATTERY_THRESHOLDS = {
	low: 20,
	critical: 10,
} as const;

export type BatteryLevel = "ok" | "low" | "critical";

// Robots report roughly once per second, so this tolerates ~10 missed reports.
export const STALE_AFTER_MS = 10_000;

export function getBatteryLevel(battery: number): BatteryLevel {
	if (battery <= BATTERY_THRESHOLDS.critical) return "critical";
	if (battery <= BATTERY_THRESHOLDS.low) return "low";
	return "ok";
}

export function isStale(lastSeenAt: Date, now: Date): boolean {
	return now.getTime() - lastSeenAt.getTime() > STALE_AFTER_MS;
}

export function getEffectiveStatus(robot: Robot, now: Date): RobotStatus {
	return isStale(robot.lastSeenAt, now) ? "offline" : robot.reportedStatus;
}

// Ordered by severity, most severe first.
export const ATTENTION_REASONS = [
	"error",
	"offline",
	"battery-critical",
] as const;

export type AttentionReason = (typeof ATTENTION_REASONS)[number];

export function getAttentionReasons(
	robot: Robot,
	now: Date,
): AttentionReason[] {
	const status = getEffectiveStatus(robot, now);
	const battery = getBatteryLevel(robot.battery);
	const reasons: AttentionReason[] = [];

	if (status === "error") reasons.push("error");
	if (status === "offline") reasons.push("offline");
	// A critical robot that is already charging is being handled.
	if (battery === "critical" && robot.reportedStatus !== "charging") {
		reasons.push("battery-critical");
	}

	return reasons;
}
