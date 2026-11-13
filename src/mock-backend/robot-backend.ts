// Stand-in for the telemetry backend. It deliberately speaks the backend's language
// (snake_case, ISO strings, its own enum values) over a real `Response`, so the
// application layer has to validate and map it exactly as it would a real API call.

type RobotFixture = {
	id: string;
	name: string;
	model: string;
	site: { id: string; name: string };
	status: "active" | "idle" | "charging" | "error";
	/** Fixed battery, or null to simulate a draining battery. */
	battery_pct: number | null;
	/** Fixed pose, or null to simulate driving a loop. */
	pose: { x_m: number; y_m: number; heading_deg: number } | null;
	/** How long ago the robot last reported. */
	last_seen_ago_ms: number;
	events: {
		ago_ms: number;
		level: "info" | "warn" | "error";
		message: string;
	}[];
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;

const MUNICH = { id: "site-muc", name: "Munich Warehouse" };
const HAMBURG = { id: "site-ham", name: "Hamburg Port Depot" };

const ROBOTS: RobotFixture[] = [
	{
		id: "rb-001",
		name: "Atlas",
		model: "AMR-200",
		site: MUNICH,
		status: "active",
		battery_pct: null,
		pose: null,
		last_seen_ago_ms: 400,
		events: [
			{
				ago_ms: 2 * MINUTE,
				level: "info",
				message: "Started mission: aisle restock",
			},
			{ ago_ms: 18 * MINUTE, level: "info", message: "Left charging station" },
		],
	},
	{
		id: "rb-002",
		name: "Bolt",
		model: "AMR-200",
		site: MUNICH,
		status: "charging",
		battery_pct: 8,
		pose: { x_m: 2, y_m: 1.5, heading_deg: 90 },
		last_seen_ago_ms: 700,
		events: [
			{
				ago_ms: 4 * MINUTE,
				level: "info",
				message: "Docked at charging station 1",
			},
			{
				ago_ms: 6 * MINUTE,
				level: "warn",
				message: "Battery below 10%, returning to dock",
			},
		],
	},
	{
		id: "rb-003",
		name: "Comet",
		model: "AMR-350",
		site: HAMBURG,
		status: "error",
		battery_pct: 64,
		pose: { x_m: 41.2, y_m: 17.8, heading_deg: 210 },
		last_seen_ago_ms: 900,
		events: [
			{
				ago_ms: 45 * SECOND,
				level: "error",
				message: "Lidar obstruction detected, motion halted",
			},
			{
				ago_ms: 50 * SECOND,
				level: "warn",
				message: "Path blocked, attempting re-route",
			},
			{
				ago_ms: 12 * MINUTE,
				level: "info",
				message: "Started mission: container scan",
			},
		],
	},
	{
		id: "rb-004",
		name: "Dash",
		model: "AMR-350",
		site: HAMBURG,
		status: "active",
		battery_pct: 37,
		pose: { x_m: 12.4, y_m: 30.1, heading_deg: 0 },
		last_seen_ago_ms: 7 * MINUTE,
		events: [
			{ ago_ms: 7 * MINUTE, level: "warn", message: "Wi-Fi signal weak" },
		],
	},
	{
		id: "rb-005",
		name: "Echo",
		model: "AMR-200",
		site: MUNICH,
		status: "idle",
		battery_pct: 6,
		pose: { x_m: 28.6, y_m: 9.3, heading_deg: 135 },
		last_seen_ago_ms: 1_100,
		events: [],
	},
];

// Drains from 100% to 20% over 48 minutes, then starts over.
function simulatedBattery(now: number): number {
	const drainedPct = (now / (36 * SECOND)) % 80;
	return Math.round((100 - drainedPct) * 10) / 10;
}

// One lap of a 10 m radius circle every ~10 minutes.
function simulatedPose(now: number) {
	const angle = ((now / SECOND) * 0.01) % (2 * Math.PI);
	const round = (value: number) => Math.round(value * 100) / 100;
	return {
		x_m: round(20 + 10 * Math.cos(angle)),
		y_m: round(15 + 10 * Math.sin(angle)),
		heading_deg: round(((angle * 180) / Math.PI + 90) % 360),
	};
}

function toResponse(fixture: RobotFixture, now: number) {
	return {
		robot: {
			id: fixture.id,
			name: fixture.name,
			model: fixture.model,
			site: fixture.site,
			status: fixture.status,
			battery_pct: fixture.battery_pct ?? simulatedBattery(now),
			pose: fixture.pose ?? simulatedPose(now),
			last_seen_at: new Date(now - fixture.last_seen_ago_ms).toISOString(),
		},
		events: fixture.events.map((event, index) => ({
			id: `${fixture.id}-evt-${index}`,
			timestamp: new Date(now - event.ago_ms).toISOString(),
			level: event.level,
			message: event.message,
		})),
	};
}

/** Simulates `GET /robots/:id`, including network latency and a 404 for unknown robots. */
export async function getRobotDetail(robotId: string): Promise<Response> {
	await new Promise((resolve) => setTimeout(resolve, 150));
	const fixture = ROBOTS.find((robot) => robot.id === robotId);
	if (!fixture) {
		return Response.json({ message: "Robot not found" }, { status: 404 });
	}
	return Response.json(toResponse(fixture, Date.now()));
}
