import { z } from "zod";
import { ROBOT_STATUSES } from "#/domain/robot";

// Invalid values (e.g. from a hand-edited URL) fall back to "no filter" instead of erroring.
export const fleetSearchSchema = z.object({
	site: z.string().optional().catch(undefined),
	status: z.enum(ROBOT_STATUSES).optional().catch(undefined),
});

export type FleetSearch = z.infer<typeof fleetSearchSchema>;
