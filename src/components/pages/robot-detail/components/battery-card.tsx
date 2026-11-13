import { BatteryChargingIcon, BatteryIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";
import { APP_LOCALE } from "#/constants/locale";
import type { BatteryLevel } from "#/domain/robot";
import { cn } from "#/lib/utils";

const LEVEL_APPEARANCE: Record<
	BatteryLevel,
	{ label: string; text: string; indicator: string }
> = {
	ok: {
		label: "Healthy",
		text: "text-muted-foreground",
		indicator: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
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

type BatteryCardProps = {
	battery: number;
	level: BatteryLevel;
	isCharging: boolean;
};

export function BatteryCard({ battery, level, isCharging }: BatteryCardProps) {
	const { label, text, indicator } = LEVEL_APPEARANCE[level];
	const Icon = isCharging ? BatteryChargingIcon : BatteryIcon;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<Icon className="size-4" />
					Battery
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-3xl font-semibold tabular-nums">
					{Math.round(battery)}%
				</p>
				<Progress
					value={battery}
					locale={APP_LOCALE}
					aria-label="Battery level"
					className={indicator}
				/>
				<p className={cn("text-sm", text)}>
					{label}
					{isCharging && " · charging"}
				</p>
			</CardContent>
		</Card>
	);
}
