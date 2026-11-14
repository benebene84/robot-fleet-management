import type { AttentionReason } from "#/domain/robot";

export const ATTENTION_REASON_LABELS: Record<AttentionReason, string> = {
	error: "Robot reports an error",
	offline: "No recent telemetry",
	"battery-critical": "Battery critically low",
};
