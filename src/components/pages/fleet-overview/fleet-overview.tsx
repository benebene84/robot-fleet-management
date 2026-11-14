import { useFleet } from "#/application/fleet";
import {
	byAttention,
	type FleetFilter,
	filterRobots,
	summarizeFleet,
} from "#/domain/fleet";
import { useNow } from "#/hooks/use-now";
import { FleetFilters } from "./components/fleet-filters";
import { FleetSummaryCards } from "./components/fleet-summary-cards";
import { RobotTable } from "./components/robot-table";

type FleetOverviewPageProps = {
	filter: FleetFilter;
	onFilterChange: (filter: FleetFilter) => void;
};

export function FleetOverviewPage({
	filter,
	onFilterChange,
}: FleetOverviewPageProps) {
	const { data, isRefetchError } = useFleet();
	const now = useNow();

	// The summary and status counts follow the site filter only, so they keep showing
	// the whole picture while a status is selected.
	const siteRobots = filterRobots(data.robots, { siteId: filter.siteId }, now);
	const summary = summarizeFleet(siteRobots, now);
	const visibleRobots = filterRobots(
		siteRobots,
		{ status: filter.status },
		now,
	).sort(byAttention(now));

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
			<h1 className="text-2xl font-semibold tracking-tight">Fleet</h1>
			{isRefetchError && (
				<output className="text-sm text-muted-foreground">
					Lost connection to the server. Showing the last data received.
				</output>
			)}
			<FleetSummaryCards summary={summary} />
			<FleetFilters
				sites={data.sites}
				filter={filter}
				statusCounts={summary.byStatus}
				onFilterChange={onFilterChange}
			/>
			<RobotTable
				robots={visibleRobots}
				now={now}
				emptyMessage={
					siteRobots.length === 0
						? "No robots are deployed at this site yet."
						: "No robots match the selected filters."
				}
			/>
		</main>
	);
}
