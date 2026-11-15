import { createFileRoute } from "@tanstack/react-router";
import { fleetSearchSchema } from "#/application/fleet";
import { robotDetailQueryOptions } from "#/application/robot";
import { RouteError } from "#/components/error/route-error";
import { RobotDetailPage } from "#/components/pages/robot-detail/robot-detail";
import { RobotDetailSkeleton } from "#/components/pages/robot-detail/robot-detail-skeleton";
import { RobotNotFound } from "#/components/pages/robot-detail/robot-not-found";

export const Route = createFileRoute("/robots/$robotId")({
	validateSearch: fleetSearchSchema,
	loader: ({ context, params }) =>
		context.queryClient.query({
			...robotDetailQueryOptions(params.robotId),
			staleTime: "static",
		}),
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.robot.name} · Robot Fleet Management`
					: "Robot Fleet Management",
			},
		],
	}),
	component: RouteComponent,
	pendingComponent: RobotDetailSkeleton,
	notFoundComponent: RobotNotFound,
	errorComponent: RouteError,
});

function RouteComponent() {
	const { robotId } = Route.useParams();
	const fleetSearch = Route.useSearch();
	return <RobotDetailPage robotId={robotId} fleetSearch={fleetSearch} />;
}
