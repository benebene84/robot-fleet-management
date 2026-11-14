import { useEffect, useSyncExternalStore } from "react";
import {
	applyTheme,
	isThemeStorageEvent,
	prefersDarkQuery,
	readStoredTheme,
	storeTheme,
	type Theme,
} from "#/lib/theme";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
	// Keeps other open tabs in sync when the theme is changed in one of them.
	const handleStorage = (event: StorageEvent) => {
		if (!isThemeStorageEvent(event)) return;
		applyTheme(readStoredTheme());
		onChange();
	};

	listeners.add(onChange);
	window.addEventListener("storage", handleStorage);
	return () => {
		listeners.delete(onChange);
		window.removeEventListener("storage", handleStorage);
	};
}

export function useTheme() {
	const theme = useSyncExternalStore<Theme>(
		subscribe,
		readStoredTheme,
		() => "system",
	);

	// While following the system, react to the OS switching between light and dark.
	useEffect(() => {
		if (theme !== "system") return;
		const query = prefersDarkQuery();
		const handleChange = () => applyTheme("system");
		query.addEventListener("change", handleChange);
		return () => query.removeEventListener("change", handleChange);
	}, [theme]);

	const setTheme = (next: Theme) => {
		storeTheme(next);
		applyTheme(next);
		for (const listener of listeners) listener();
	};

	return { theme, setTheme };
}
