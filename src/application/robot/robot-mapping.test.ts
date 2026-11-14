import { describe, expect, it } from "vitest";
import { mapRobotDetailResponse } from "./robot-mapping";
import {
	type RobotDetailResponse,
	robotDetailResponseSchema,
} from "./robot-schema";

function buildResponse(): RobotDetailResponse {
	return {
		robot: {
			id: "rb-001",
			name: "Atlas",
			model: "AMR-200",
			site: { id: "site-muc", name: "Munich Warehouse" },
			status: "active",
			battery_pct: 72.5,
			pose: { x_m: 12.3, y_m: 4.5, heading_deg: 90 },
			last_seen_at: "2026-11-13T12:00:00.000Z",
		},
		events: [
			{
				id: "evt-older",
				timestamp: "2026-11-13T11:00:00.000Z",
				level: "warn",
				message: "Path blocked",
			},
			{
				id: "evt-newer",
				timestamp: "2026-11-13T11:30:00.000Z",
				level: "error",
				message: "Lidar obstruction",
			},
		],
	};
}

describe("robotDetailResponseSchema", () => {
	it("accepts a valid response", () => {
		expect(robotDetailResponseSchema.safeParse(buildResponse()).success).toBe(
			true,
		);
	});

	it("rejects an unknown status", () => {
		const response = buildResponse();
		const invalid = {
			...response,
			robot: { ...response.robot, status: "dancing" },
		};
		expect(robotDetailResponseSchema.safeParse(invalid).success).toBe(false);
	});

	it("rejects a battery outside 0–100", () => {
		const response = buildResponse();
		const invalid = {
			...response,
			robot: { ...response.robot, battery_pct: 140 },
		};
		expect(robotDetailResponseSchema.safeParse(invalid).success).toBe(false);
	});

	it("rejects a timestamp that is not ISO 8601", () => {
		const response = buildResponse();
		const invalid = {
			...response,
			robot: { ...response.robot, last_seen_at: "yesterday" },
		};
		expect(robotDetailResponseSchema.safeParse(invalid).success).toBe(false);
	});

	it("rejects a response with missing fields", () => {
		const { events: _events, ...withoutEvents } = buildResponse();
		expect(robotDetailResponseSchema.safeParse(withoutEvents).success).toBe(
			false,
		);
	});
});

describe("mapRobotDetailResponse", () => {
	it("maps the robot into the domain shape", () => {
		const { robot } = mapRobotDetailResponse(buildResponse());

		expect(robot).toEqual({
			id: "rb-001",
			name: "Atlas",
			model: "AMR-200",
			site: { id: "site-muc", name: "Munich Warehouse" },
			reportedStatus: "active",
			battery: 72.5,
			position: { x: 12.3, y: 4.5, heading: 90 },
			lastSeenAt: new Date("2026-11-13T12:00:00.000Z"),
		});
	});

	it("maps event levels to domain severities", () => {
		const { events } = mapRobotDetailResponse(buildResponse());
		expect(events.map((event) => event.severity)).toEqual(["error", "warning"]);
	});

	it("sorts events newest first", () => {
		const { events } = mapRobotDetailResponse(buildResponse());
		expect(events.map((event) => event.id)).toEqual(["evt-newer", "evt-older"]);
	});
});
