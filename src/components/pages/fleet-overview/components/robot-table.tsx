import { Link } from "@tanstack/react-router";
import { AttentionIndicator } from "#/components/shared/attention-indicator";
import { BATTERY_LEVEL_APPEARANCE } from "#/components/shared/battery-appearance";
import { RelativeTime } from "#/components/shared/relative-time";
import { StatusBadge } from "#/components/shared/status-badge";
import { Card } from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { APP_LOCALE } from "#/constants/locale";
import {
	getAttentionReasons,
	getBatteryLevel,
	getEffectiveStatus,
	type Robot,
} from "#/domain/robot";
import { cn } from "#/lib/utils";

type RobotTableProps = {
	robots: Robot[];
	now: Date;
	emptyMessage: string;
};

export function RobotTable({ robots, now, emptyMessage }: RobotTableProps) {
	if (robots.length === 0) {
		return (
			<Card className="p-8 text-center text-muted-foreground">
				{emptyMessage}
			</Card>
		);
	}

	return (
		<Card className="py-0">
			{/* Extra padding on the outer columns so the table aligns with the card's edges. */}
			{/* Fixed layout so columns keep their width while live values like "Last report" change. */}
			<Table className="min-w-3xl table-fixed [&_tr>*:first-child]:pl-4 [&_tr>*:last-child]:pr-4">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[26%]">Robot</TableHead>
						<TableHead className="w-[22%]">Site</TableHead>
						<TableHead className="w-[15%]">Status</TableHead>
						<TableHead className="w-[17%]">Battery</TableHead>
						<TableHead className="w-[20%]">Last report</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{robots.map((robot) => {
						const battery =
							BATTERY_LEVEL_APPEARANCE[getBatteryLevel(robot.battery)];

						return (
							<TableRow key={robot.id}>
								<TableCell>
									<div className="flex items-center gap-2">
										<Link
											to="/robots/$robotId"
											params={{ robotId: robot.id }}
											search={(prev) => prev}
											className="font-medium hover:underline"
										>
											{robot.name}
										</Link>
										<span className="text-muted-foreground">{robot.id}</span>
										<AttentionIndicator
											reasons={getAttentionReasons(robot, now)}
										/>
									</div>
								</TableCell>
								<TableCell className="truncate" title={robot.site.name}>
									{robot.site.name}
								</TableCell>
								<TableCell>
									<StatusBadge status={getEffectiveStatus(robot, now)} />
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Progress
											value={robot.battery}
											locale={APP_LOCALE}
											aria-label={`${robot.name} battery level`}
											className={cn("w-16", battery.indicator)}
										/>
										<span className={cn("tabular-nums", battery.text)}>
											{Math.round(robot.battery)}%
										</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground">
									<RelativeTime date={robot.lastSeenAt} now={now} />
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
}
