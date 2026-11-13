import { useRobotDetail } from "#/application/robot";
import {
	getAttentionReasons,
	getBatteryLevel,
	getEffectiveStatus,
	isStale,
} from "#/domain/robot";
import { useNow } from "#/hooks/use-now";
import { AttentionAlerts } from "./components/attention-alerts";
import { BatteryCard } from "./components/battery-card";
import { EventLog } from "./components/event-log";
import { LastSeenCard } from "./components/last-seen-card";
import { PositionCard } from "./components/position-card";
import { RobotHeader } from "./components/robot-header";

type RobotDetailPageProps = {
	robotId: string;
};

export function RobotDetailPage({ robotId }: RobotDetailPageProps) {
	const { data, isRefetchError } = useRobotDetail(robotId);
	const now = useNow();
	const { robot, events } = data;

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
			<RobotHeader robot={robot} status={getEffectiveStatus(robot, now)} />
			{isRefetchError && (
				<output className="text-sm text-muted-foreground">
					Lost connection to the server. Showing the last data received.
				</output>
			)}
			<AttentionAlerts reasons={getAttentionReasons(robot, now)} />
			<section className="grid gap-4 md:grid-cols-3">
				<BatteryCard
					battery={robot.battery}
					level={getBatteryLevel(robot.battery)}
					isCharging={robot.reportedStatus === "charging"}
				/>
				<PositionCard position={robot.position} siteName={robot.siteName} />
				<LastSeenCard
					lastSeenAt={robot.lastSeenAt}
					now={now}
					isStale={isStale(robot.lastSeenAt, now)}
				/>
			</section>
			<EventLog events={events} now={now} />
		</main>
	);
}
