import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { RelativeTime } from "#/components/shared/relative-time";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { EventSeverity, RobotEvent } from "#/domain/robot";
import { cn } from "#/lib/utils";

const SEVERITY_APPEARANCE: Record<
	EventSeverity,
	{ icon: typeof InfoIcon; className: string; label: string }
> = {
	info: { icon: InfoIcon, className: "text-muted-foreground", label: "Info" },
	warning: {
		icon: TriangleAlertIcon,
		className: "text-amber-600",
		label: "Warning",
	},
	error: {
		icon: CircleAlertIcon,
		className: "text-destructive",
		label: "Error",
	},
};

type EventLogProps = {
	events: RobotEvent[];
	now: Date;
};

export function EventLog({ events, now }: EventLogProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent events</CardTitle>
			</CardHeader>
			<CardContent>
				{events.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recent events.</p>
				) : (
					<ol className="flex flex-col divide-y">
						{events.map((event) => {
							const {
								icon: Icon,
								className,
								label,
							} = SEVERITY_APPEARANCE[event.severity];
							return (
								<li
									key={event.id}
									className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
								>
									<Icon
										className={cn("mt-0.5 size-4 shrink-0", className)}
										aria-label={label}
									/>
									<p className="flex-1 text-sm">{event.message}</p>
									<RelativeTime
										date={event.occurredAt}
										now={now}
										className="shrink-0 text-sm text-muted-foreground"
									/>
								</li>
							);
						})}
					</ol>
				)}
			</CardContent>
		</Card>
	);
}
