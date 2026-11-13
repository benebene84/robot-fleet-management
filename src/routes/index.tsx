import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: FleetOverviewPage });

// Placeholder until the fleet overview exists: one link per mock scenario.
const EXAMPLE_ROBOTS = [
	{ id: "rb-001", scenario: "Active, moving, battery draining" },
	{ id: "rb-002", scenario: "Charging with critical battery" },
	{ id: "rb-003", scenario: "Error" },
	{ id: "rb-004", scenario: "Offline (stale telemetry)" },
	{ id: "rb-005", scenario: "Idle with critical battery" },
	{ id: "rb-999", scenario: "Unknown robot (404)" },
];

function FleetOverviewPage() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-6">
			<h1 className="text-2xl font-semibold tracking-tight">Fleet</h1>
			<ul className="flex flex-col gap-2">
				{EXAMPLE_ROBOTS.map(({ id, scenario }) => (
					<li key={id}>
						<Link
							to="/robots/$robotId"
							params={{ robotId: id }}
							className="underline underline-offset-4"
						>
							{id}
						</Link>
						<span className="text-muted-foreground"> · {scenario}</span>
					</li>
				))}
			</ul>
		</main>
	);
}
