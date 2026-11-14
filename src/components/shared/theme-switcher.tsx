import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "#/hooks/use-theme";
import type { Theme } from "#/lib/theme";
import { cn } from "#/lib/utils";

const OPTIONS: { theme: Theme; label: string; icon: typeof SunIcon }[] = [
	{ theme: "system", label: "System theme", icon: MonitorIcon },
	{ theme: "light", label: "Light theme", icon: SunIcon },
	{ theme: "dark", label: "Dark theme", icon: MoonIcon },
];

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<fieldset className="fixed bottom-4 left-4 z-40 flex gap-0.5 rounded-full border bg-card p-1 shadow-sm">
			<legend className="sr-only">Theme</legend>
			{OPTIONS.map(({ theme: option, label, icon: Icon }) => (
				<button
					key={option}
					type="button"
					aria-label={label}
					aria-pressed={theme === option}
					title={label}
					onClick={() => setTheme(option)}
					className={cn(
						"rounded-full p-1.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
						theme === option && "bg-muted text-foreground",
					)}
				>
					<Icon className="size-4" />
				</button>
			))}
		</fieldset>
	);
}
