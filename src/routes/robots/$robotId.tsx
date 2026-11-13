import { createFileRoute } from "@tanstack/react-router";
import { robotDetailQueryOptions } from "#/application/robot";
import { RouteError } from "#/components/error/route-error";
import { RobotDetailPage } from "#/components/pages/robot-detail/robot-detail";
import { RobotDetailSkeleton } from "#/components/pages/robot-detail/robot-detail-skeleton";
import { RobotNotFound } from "#/components/pages/robot-detail/robot-not-found";

export const Route = createFileRoute("/robots/$robotId")({
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
	return <RobotDetailPage robotId={robotId} />;
}
