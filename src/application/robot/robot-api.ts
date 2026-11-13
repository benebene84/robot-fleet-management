import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { RobotDetail } from "#/domain/robot";
import { getRobotDetail } from "#/mock-backend/robot-backend";
import { mapRobotDetailResponse } from "./robot-mapping";
import { robotDetailResponseSchema } from "./robot-schema";

export const fetchRobotDetail = createServerFn({ method: "GET" })
	.validator(z.object({ robotId: z.string().min(1) }))
	.handler(async ({ data }): Promise<RobotDetail> => {
		const { robotId } = data;
		const response = await getRobotDetail(robotId);

		if (response.status === 404) {
			throw notFound();
		}
		if (!response.ok) {
			console.error("[fetchRobotDetail] Failed to fetch robot detail", {
				robotId,
				status: response.status,
			});
			throw new Error(`Failed to fetch robot ${robotId}: ${response.status}`);
		}

		const parsed = robotDetailResponseSchema.safeParse(await response.json());
		if (!parsed.success) {
			console.error("[fetchRobotDetail] Invalid robot detail response", {
				robotId,
				issues: z.prettifyError(parsed.error),
			});
			throw new Error(`Received invalid data for robot ${robotId}`);
		}

		return mapRobotDetailResponse(parsed.data);
	});
