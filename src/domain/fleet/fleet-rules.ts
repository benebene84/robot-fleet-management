import {
	ATTENTION_REASONS,
	allRobotStatuses,
	getAttentionReasons,
	getEffectiveStatus,
	type Robot,
	type RobotStatus,
} from "#/domain/robot";
import type { FleetFilter, FleetSummary } from "./types";

export function summarizeFleet(robots: Robot[], now: Date): FleetSummary {
	const byStatus = Object.fromEntries(
		allRobotStatuses.map((status) => [status, 0]),
	) as Record<RobotStatus, number>;
	let needsAttention = 0;
	let batteryTotal = 0;

	for (const robot of robots) {
		byStatus[getEffectiveStatus(robot, now)] += 1;
		if (getAttentionReasons(robot, now).length > 0) needsAttention += 1;
		batteryTotal += robot.battery;
	}

	return {
		total: robots.length,
		byStatus,
		needsAttention,
		averageBattery: robots.length > 0 ? batteryTotal / robots.length : null,
	};
}

export function filterRobots(
	robots: Robot[],
	{ siteId, status }: FleetFilter,
	now: Date,
): Robot[] {
	return robots.filter(
		(robot) =>
			(siteId === undefined || robot.site.id === siteId) &&
			(status === undefined || getEffectiveStatus(robot, now) === status),
	);
}

function attentionRank(robot: Robot, now: Date): number {
	const [mostSevere] = getAttentionReasons(robot, now);
	return mostSevere === undefined
		? ATTENTION_REASONS.length
		: ATTENTION_REASONS.indexOf(mostSevere);
}

/** Comparator that lists robots needing attention first (most severe first), then by name. */
export function byAttention(now: Date) {
	return (a: Robot, b: Robot) =>
		attentionRank(a, now) - attentionRank(b, now) ||
		a.name.localeCompare(b.name);
}
