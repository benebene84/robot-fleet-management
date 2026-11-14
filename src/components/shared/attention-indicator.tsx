import { TriangleAlertIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import type { AttentionReason } from "#/domain/robot";
import { ATTENTION_REASON_LABELS } from "./attention-labels";

type AttentionIndicatorProps = {
	reasons: AttentionReason[];
};

export function AttentionIndicator({ reasons }: AttentionIndicatorProps) {
	if (reasons.length === 0) return null;

	const labels = reasons.map((reason) => ATTENTION_REASON_LABELS[reason]);

	return (
		<Tooltip>
			<TooltipTrigger
				aria-label={`Needs attention: ${labels.join(", ")}`}
				className="inline-flex rounded-sm text-destructive outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
			>
				<TriangleAlertIcon className="size-4" />
			</TooltipTrigger>
			<TooltipContent>
				<ul>
					{labels.map((label) => (
						<li key={label}>{label}</li>
					))}
				</ul>
			</TooltipContent>
		</Tooltip>
	);
}
