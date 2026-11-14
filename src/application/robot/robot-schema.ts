import { z } from "zod";

// Backend contracts for `GET /robots` and `GET /robots/:id`. Anything that does not match
// is rejected before it reaches the domain.
export const siteSchema = z.object({ id: z.string(), name: z.string() });

export const robotSchema = z.object({
	id: z.string(),
	name: z.string(),
	model: z.string(),
	site: siteSchema,
	status: z.enum(["active", "idle", "charging", "error"]),
	battery_pct: z.number().min(0).max(100),
	pose: z.object({
		x_m: z.number(),
		y_m: z.number(),
		heading_deg: z.number(),
	}),
	last_seen_at: z.iso.datetime(),
});

export const robotDetailResponseSchema = z.object({
	robot: robotSchema,
	events: z.array(
		z.object({
			id: z.string(),
			timestamp: z.iso.datetime(),
			level: z.enum(["info", "warn", "error"]),
			message: z.string(),
		}),
	),
});

export type RobotDto = z.infer<typeof robotSchema>;
export type RobotDetailResponse = z.infer<typeof robotDetailResponseSchema>;
