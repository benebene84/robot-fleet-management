import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: FleetOverviewPage });

function FleetOverviewPage() {
	return (
		<main className="p-8">
			<h1 className="text-2xl font-semibold">Fleet overview</h1>
		</main>
	);
}
