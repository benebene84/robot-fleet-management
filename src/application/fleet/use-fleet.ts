import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchFleet } from "./fleet-api";

const POLL_INTERVAL_MS = 5_000;

export const fleetQueryOptions = queryOptions({
	queryKey: ["fleet"],
	queryFn: () => fetchFleet(),
	refetchInterval: POLL_INTERVAL_MS,
	retry: 1,
});

export function useFleet() {
	return useSuspenseQuery(fleetQueryOptions);
}
