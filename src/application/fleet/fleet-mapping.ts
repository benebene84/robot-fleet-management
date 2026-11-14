import { mapRobot } from "#/application/robot/robot-mapping";
import type { Fleet } from "#/domain/fleet";
import type { FleetResponse } from "./fleet-schema";

export function mapFleetResponse({ sites, robots }: FleetResponse): Fleet {
	return {
		sites,
		robots: robots.map(mapRobot),
	};
}
