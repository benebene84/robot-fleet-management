import type { EventSeverity, Robot, RobotDetail } from "#/domain/robot";
import type { RobotDetailResponse, RobotDto } from "./robot-schema";

type EventLevel = RobotDetailResponse["events"][number]["level"];

const EVENT_SEVERITY_BY_LEVEL: Record<EventLevel, EventSeverity> = {
	info: "info",
	warn: "warning",
	error: "error",
};

// This maps the api response into the format we defined and expect from domain.
// Then this data can be just passed on to "dumb" components later
// If there are ever breaking changes or we don't like how data is coming,
// we have a central layer to adapt
export function mapRobot(robot: RobotDto): Robot {
	return {
		id: robot.id,
		name: robot.name,
		model: robot.model,
		site: robot.site,
		reportedStatus: robot.status,
		battery: robot.battery_pct,
		position: {
			x: robot.pose.x_m,
			y: robot.pose.y_m,
			heading: robot.pose.heading_deg,
		},
		lastSeenAt: new Date(robot.last_seen_at),
	};
}

export function mapRobotDetailResponse({
	robot,
	events,
}: RobotDetailResponse): RobotDetail {
	return {
		robot: mapRobot(robot),
		events: events
			.map((event) => ({
				id: event.id,
				occurredAt: new Date(event.timestamp),
				severity: EVENT_SEVERITY_BY_LEVEL[event.level],
				message: event.message,
			}))
			.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()),
	};
}
