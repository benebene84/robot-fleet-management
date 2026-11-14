import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { StatusBadge } from "#/components/shared/status-badge";
import type { Robot, RobotStatus } from "#/domain/robot";

type RobotHeaderProps = {
	robot: Robot;
	status: RobotStatus;
};

export function RobotHeader({ robot, status }: RobotHeaderProps) {
	return (
		<header className="flex flex-col gap-3">
			<Link
				to="/"
				className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeftIcon className="size-4" />
				Fleet
			</Link>
			<div className="flex flex-wrap items-center gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">{robot.name}</h1>
				<StatusBadge status={status} />
			</div>
			<p className="text-sm text-muted-foreground">
				{robot.id} · {robot.model} · {robot.site.name}
			</p>
		</header>
	);
}
