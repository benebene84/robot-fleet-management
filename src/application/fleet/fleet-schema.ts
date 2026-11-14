import { z } from "zod";
import { robotSchema, siteSchema } from "#/application/robot/robot-schema";

const fleetSiteSchema = siteSchema.extend({
	width_m: z.number().positive(),
	height_m: z.number().positive(),
});

export const fleetResponseSchema = z.object({
	sites: z.array(fleetSiteSchema),
	robots: z.array(robotSchema),
});

export type FleetResponse = z.infer<typeof fleetResponseSchema>;
