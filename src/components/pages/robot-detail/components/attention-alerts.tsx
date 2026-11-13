import { BatteryWarningIcon, CircleAlertIcon, WifiOffIcon } from "lucide-react";
import type { AttentionReason } from "#/domain/robot";

const ALERT_CONTENT: Record<
	AttentionReason,
	{ icon: typeof CircleAlertIcon; title: string; description: string }
> = {
	error: {
		icon: CircleAlertIcon,
		title: "Robot reports an error",
		description: "Check the event log for the cause.",
	},
	offline: {
		icon: WifiOffIcon,
		title: "No recent telemetry",
		description:
			"The values below are the last known state and may be outdated.",
	},
	"battery-critical": {
		icon: BatteryWarningIcon,
		title: "Battery critically low",
		description: "The robot is not charging and may stop soon.",
	},
};

type AttentionAlertsProps = {
	reasons: AttentionReason[];
};

export function AttentionAlerts({ reasons }: AttentionAlertsProps) {
	if (reasons.length === 0) return null;

	return (
		<ul className="flex flex-col gap-2">
			{reasons.map((reason) => {
				const { icon: Icon, title, description } = ALERT_CONTENT[reason];
				return (
					<li
						key={reason}
						role="alert"
						className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
					>
						<Icon className="mt-0.5 size-4 shrink-0 text-destructive" />
						<div>
							<p className="font-medium">{title}</p>
							<p className="text-muted-foreground">{description}</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
