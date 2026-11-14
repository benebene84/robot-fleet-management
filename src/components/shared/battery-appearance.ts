import type { BatteryLevel } from "#/domain/robot";

export const BATTERY_LEVEL_APPEARANCE: Record<
	BatteryLevel,
	{ label: string; text: string; indicator: string }
> = {
	ok: {
		label: "Healthy",
		text: "text-muted-foreground",
		indicator: "[&_[data-slot=progress-indicator]]:bg-foreground/70",
	},
	low: {
		label: "Low",
		text: "text-amber-600",
		indicator: "[&_[data-slot=progress-indicator]]:bg-amber-500",
	},
	critical: {
		label: "Critical",
		text: "text-destructive",
		indicator: "[&_[data-slot=progress-indicator]]:bg-destructive",
	},
};
