export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
	return THEMES.includes(value as Theme);
}

export function readStoredTheme(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	return isTheme(stored) ? stored : "system";
}

export function storeTheme(theme: Theme) {
	localStorage.setItem(STORAGE_KEY, theme);
}

export function isThemeStorageEvent(event: StorageEvent): boolean {
	return event.key === STORAGE_KEY;
}

export function prefersDarkQuery(): MediaQueryList {
	return window.matchMedia(DARK_QUERY);
}

export function applyTheme(theme: Theme) {
	const dark =
		theme === "dark" || (theme === "system" && prefersDarkQuery().matches);
	const root = document.documentElement;
	root.classList.toggle("dark", dark);
	root.style.colorScheme = dark ? "dark" : "light";
}

// Runs inline in <head> before the first paint, so a stored dark theme never flashes light.
// Mirrors `applyTheme`, which cannot be referenced here because this is a string.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var d=t==="dark"||(t!=="light"&&window.matchMedia(${JSON.stringify(DARK_QUERY)}).matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;
