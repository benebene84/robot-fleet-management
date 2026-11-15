import { createFileRoute } from "@tanstack/react-router";
import { fleetQueryOptions, fleetSearchSchema } from "#/application/fleet";
import { RouteError } from "#/components/error/route-error";
import { FleetOverviewPage } from "#/components/pages/fleet-overview/fleet-overview";
import { FleetOverviewSkeleton } from "#/components/pages/fleet-overview/fleet-overview-skeleton";
import type { FleetFilter } from "#/domain/fleet";

export const Route = createFileRoute("/")({
	validateSearch: fleetSearchSchema,
	loader: ({ context }) =>
		context.queryClient.query({ ...fleetQueryOptions, staleTime: "static" }),
	head: () => ({ meta: [{ title: "Fleet · Robot Fleet Management" }] }),
	component: RouteComponent,
	pendingComponent: FleetOverviewSkeleton,
	errorComponent: RouteError,
});

function RouteComponent() {
	const { site, status } = Route.useSearch();
	const navigate = Route.useNavigate();

	const handleFilterChange = (filter: FleetFilter) =>
		navigate({
			search: { site: filter.siteId, status: filter.status },
			replace: true,
		});

	return (
		<FleetOverviewPage
			filter={{ siteId: site, status }}
			onFilterChange={handleFilterChange}
		/>
	);
}
