import {
	ActivityIcon,
	BatteryMediumIcon,
	BotIcon,
	TriangleAlertIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { FleetSummary } from "#/domain/fleet";
import { cn } from "#/lib/utils";

type SummaryCardProps = {
	icon: typeof BotIcon;
	title: string;
	children: ReactNode;
	className?: string;
};

function SummaryCard({
	icon: Icon,
	title,
	children,
	className,
}: SummaryCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<Icon className="size-4" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className={cn("text-3xl font-semibold tabular-nums", className)}>
					{children}
				</p>
			</CardContent>
		</Card>
	);
}

type FleetSummaryCardsProps = {
	summary: FleetSummary;
};

export function FleetSummaryCards({ summary }: FleetSummaryCardsProps) {
	return (
		<section className="grid grid-cols-2 gap-4 md:grid-cols-4">
			<SummaryCard icon={BotIcon} title="Robots">
				{summary.total}
			</SummaryCard>
			<SummaryCard
				icon={TriangleAlertIcon}
				title="Need attention"
				className={cn(summary.needsAttention > 0 && "text-destructive")}
			>
				{summary.needsAttention}
			</SummaryCard>
			<SummaryCard icon={ActivityIcon} title="Active">
				{summary.byStatus.active}
			</SummaryCard>
			<SummaryCard icon={BatteryMediumIcon} title="Avg. battery">
				{summary.averageBattery === null
					? "–"
					: `${Math.round(summary.averageBattery)}%`}
			</SummaryCard>
		</section>
	);
}
