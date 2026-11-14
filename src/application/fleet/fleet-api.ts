import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Fleet } from "#/domain/fleet";
import { getFleet } from "#/mock-backend/robot-backend";
import { mapFleetResponse } from "./fleet-mapping";
import { fleetResponseSchema } from "./fleet-schema";

export const fetchFleet = createServerFn({ method: "GET" }).handler(
	async (): Promise<Fleet> => {
		const response = await getFleet();

		if (!response.ok) {
			console.error("[fetchFleet] Failed to fetch fleet", {
				status: response.status,
			});
			throw new Error(`Failed to fetch fleet: ${response.status}`);
		}

		const parsed = fleetResponseSchema.safeParse(await response.json());
		if (!parsed.success) {
			console.error("[fetchFleet] Invalid fleet response", {
				issues: z.prettifyError(parsed.error),
			});
			throw new Error("Received invalid fleet data");
		}

		return mapFleetResponse(parsed.data);
	},
);
