import { mapRobot } from "#/application/robot/robot-mapping";
import type { Fleet } from "#/domain/fleet";
import type { FleetResponse } from "./fleet-schema";

export function mapFleetResponse({ sites, robots }: FleetResponse): Fleet {
	return {
		sites: sites.map((site) => ({
			id: site.id,
			name: site.name,
			dimensions: { width: site.width_m, height: site.height_m },
		})),
		robots: robots.map(mapRobot),
	};
}
