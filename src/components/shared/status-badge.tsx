import type { RobotStatus } from "#/domain/robot";
import { cn } from "#/lib/utils";

export const STATUS_LABELS: Record<RobotStatus, string> = {
	active: "Active",
	idle: "Idle",
	charging: "Charging",
	error: "Error",
	offline: "Offline",
};

const STATUS_DOT: Record<RobotStatus, string> = {
	active: "bg-emerald-500",
	idle: "bg-sky-500",
	charging: "bg-amber-500",
	error: "bg-destructive",
	offline: "bg-muted-foreground",
};

type StatusBadgeProps = {
	status: RobotStatus;
	className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
				className,
			)}
		>
			<span
				className={cn("size-2 rounded-full", STATUS_DOT[status])}
				aria-hidden
			/>
			{STATUS_LABELS[status]}
		</span>
	);
}
