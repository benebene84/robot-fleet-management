import type { RobotStatus } from "#/domain/robot";
import { cn } from "#/lib/utils";

const STATUS_APPEARANCE: Record<RobotStatus, { label: string; dot: string }> = {
	active: { label: "Active", dot: "bg-emerald-500" },
	idle: { label: "Idle", dot: "bg-sky-500" },
	charging: { label: "Charging", dot: "bg-amber-500" },
	error: { label: "Error", dot: "bg-destructive" },
	offline: { label: "Offline", dot: "bg-muted-foreground" },
};

type StatusBadgeProps = {
	status: RobotStatus;
	className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const { label, dot } = STATUS_APPEARANCE[status];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
				className,
			)}
		>
			<span className={cn("size-2 rounded-full", dot)} aria-hidden />
			{label}
		</span>
	);
}
