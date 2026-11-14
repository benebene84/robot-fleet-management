import { z } from "zod";
import { robotSchema, siteSchema } from "#/application/robot/robot-schema";

export const fleetResponseSchema = z.object({
	sites: z.array(siteSchema),
	robots: z.array(robotSchema),
});

export type FleetResponse = z.infer<typeof fleetResponseSchema>;
