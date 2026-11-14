import type { Robot, RobotStatus } from "#/domain/robot";
import type { Site } from "#/domain/site";

export type Fleet = {
	/** All sites, including those without robots. */
	sites: Site[];
	robots: Robot[];
};

export type FleetSummary = {
	total: number;
	byStatus: Record<RobotStatus, number>;
	needsAttention: number;
	/** Null when there are no robots to average. */
	averageBattery: number | null;
};

export type FleetFilter = {
	siteId?: string;
	status?: RobotStatus;
};
