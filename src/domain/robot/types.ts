import type { Site } from "#/domain/site";

// What a robot can tell us about itself. A robot cannot report being offline.
export const REPORTED_STATUSES = {
	active: "active",
	idle: "idle",
	charging: "charging",
	error: "error",
} as const;

export type ReportedStatus =
	(typeof REPORTED_STATUSES)[keyof typeof REPORTED_STATUSES];

// What the fleet manager sees: the reported status, or offline once telemetry has gone stale.
export const ROBOT_STATUSES = {
	...REPORTED_STATUSES,
	offline: "offline",
} as const;

export type RobotStatus = (typeof ROBOT_STATUSES)[keyof typeof ROBOT_STATUSES];
export const allRobotStatuses = Object.values(ROBOT_STATUSES);

export type Position = {
	/** Metres from the site origin. */
	x: number;
	y: number;
	/** Degrees, 0 = facing +x, counter-clockwise. */
	heading: number;
};

export type Robot = {
	id: string;
	name: string;
	model: string;
	site: Site;
	reportedStatus: ReportedStatus;
	/** State of charge, 0–100. */
	battery: number;
	position: Position;
	lastSeenAt: Date;
};

export const EVENT_SEVERITIES = {
	info: "info",
	warning: "warning",
	error: "error",
} as const;

export type EventSeverity =
	(typeof EVENT_SEVERITIES)[keyof typeof EVENT_SEVERITIES];

export type RobotEvent = {
	id: string;
	occurredAt: Date;
	severity: EventSeverity;
	message: string;
};

export type RobotDetail = {
	robot: Robot;
	events: RobotEvent[];
};
