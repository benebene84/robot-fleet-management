import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchRobotDetail } from "./robot-api";

// Robots report about once per second; polling a bit slower keeps the view fresh
// without hammering the backend.
const POLL_INTERVAL_MS = 5_000;

export const robotDetailQueryOptions = (robotId: string) =>
	queryOptions({
		queryKey: ["robot-detail", robotId],
		queryFn: () => fetchRobotDetail({ data: { robotId } }),
		refetchInterval: POLL_INTERVAL_MS,
		retry: 1,
	});

export function useRobotDetail(robotId: string) {
	return useSuspenseQuery(robotDetailQueryOptions(robotId));
}
