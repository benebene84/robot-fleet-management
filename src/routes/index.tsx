import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { fleetQueryOptions } from "#/application/fleet";
import { RouteError } from "#/components/error/route-error";
import { FleetOverviewPage } from "#/components/pages/fleet-overview/fleet-overview";
import { FleetOverviewSkeleton } from "#/components/pages/fleet-overview/fleet-overview-skeleton";
import type { FleetFilter } from "#/domain/fleet";
import { ROBOT_STATUSES } from "#/domain/robot";

// Invalid values (e.g. from a hand-edited URL) fall back to "no filter" instead of erroring.
const fleetSearchSchema = z.object({
	site: z.string().optional().catch(undefined),
	status: z.enum(ROBOT_STATUSES).optional().catch(undefined),
});

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
