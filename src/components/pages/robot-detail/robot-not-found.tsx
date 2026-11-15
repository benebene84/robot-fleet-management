import { getRouteApi, Link } from "@tanstack/react-router";

const robotRoute = getRouteApi("/robots/$robotId");

export function RobotNotFound() {
	const fleetSearch = robotRoute.useSearch();

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-2 p-6">
			<h1 className="text-2xl font-semibold">Robot not found</h1>
			<p className="text-muted-foreground">
				This robot does not exist or is no longer part of the fleet.
			</p>
			<Link
				to="/"
				search={fleetSearch}
				className="text-sm underline underline-offset-4"
			>
				Back to the fleet
			</Link>
		</main>
	);
}
