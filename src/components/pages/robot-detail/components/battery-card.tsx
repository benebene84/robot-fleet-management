import { BatteryChargingIcon, BatteryIcon } from "lucide-react";
import { BATTERY_LEVEL_APPEARANCE } from "#/components/shared/battery-appearance";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";
import { APP_LOCALE } from "#/constants/locale";
import type { BatteryLevel } from "#/domain/robot";
import { cn } from "#/lib/utils";

type BatteryCardProps = {
	battery: number;
	level: BatteryLevel;
	isCharging: boolean;
};

export function BatteryCard({ battery, level, isCharging }: BatteryCardProps) {
	const { label, text, indicator } = BATTERY_LEVEL_APPEARANCE[level];
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
