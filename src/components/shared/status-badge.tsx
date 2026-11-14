import type { RobotStatus } from "#/domain/robot";
import { cn } from "#/lib/utils";
import { STATUS_BG, STATUS_LABELS } from "./status-appearance";

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
				className={cn("size-2 rounded-full", STATUS_BG[status])}
				aria-hidden
			/>
			{STATUS_LABELS[status]}
		</span>
	);
}
