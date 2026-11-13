import { APP_LOCALE } from "#/constants/locale";

const relativeFormat = new Intl.RelativeTimeFormat(APP_LOCALE, {
	numeric: "auto",
});
const absoluteFormat = new Intl.DateTimeFormat(APP_LOCALE, {
	dateStyle: "medium",
	timeStyle: "medium",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	["day", 86_400],
	["hour", 3_600],
	["minute", 60],
];

function formatRelative(date: Date, now: Date): string {
	const seconds = Math.round((date.getTime() - now.getTime()) / 1_000);
	for (const [unit, unitSeconds] of UNITS) {
		if (Math.abs(seconds) >= unitSeconds) {
			return relativeFormat.format(Math.round(seconds / unitSeconds), unit);
		}
	}
	return relativeFormat.format(seconds, "second");
}

type RelativeTimeProps = {
	date: Date;
	now: Date;
	className?: string;
};

export function RelativeTime({ date, now, className }: RelativeTimeProps) {
	return (
		// Server and client render at slightly different times so we suppress the hydratio wWarning
		<time
			dateTime={date.toISOString()}
			title={absoluteFormat.format(date)}
			className={className}
			suppressHydrationWarning
		>
			{formatRelative(date, now)}
		</time>
	);
}
