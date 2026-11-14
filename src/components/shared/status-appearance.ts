import type { RobotStatus } from "#/domain/robot";

export const STATUS_LABELS: Record<RobotStatus, string> = {
	active: "Active",
	idle: "Idle",
	charging: "Charging",
	error: "Error",
	offline: "Offline",
};

// Background and SVG fill variants of the same colour; Tailwind needs both spelled out.
export const STATUS_BG: Record<RobotStatus, string> = {
	active: "bg-emerald-500",
	idle: "bg-sky-500",
	charging: "bg-amber-500",
	error: "bg-destructive",
	offline: "bg-muted-foreground",
};

export const STATUS_FILL: Record<RobotStatus, string> = {
	active: "fill-emerald-500",
	idle: "fill-sky-500",
	charging: "fill-amber-500",
	error: "fill-destructive",
	offline: "fill-muted-foreground",
};
