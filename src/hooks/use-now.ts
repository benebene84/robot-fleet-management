import { useEffect, useState } from "react";

/** Current time, re-rendering every `intervalMs` so time-derived state stays fresh between polls. */
export function useNow(intervalMs = 1_000): Date {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);

	return now;
}
