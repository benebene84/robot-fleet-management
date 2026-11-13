import { RadioIcon } from "lucide-react";
import { RelativeTime } from "#/components/shared/relative-time";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { cn } from "#/lib/utils";

type LastSeenCardProps = {
	lastSeenAt: Date;
	now: Date;
	isStale: boolean;
};

export function LastSeenCard({ lastSeenAt, now, isStale }: LastSeenCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<RadioIcon className="size-4" />
					Last report
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<RelativeTime
					date={lastSeenAt}
					now={now}
					className="text-3xl font-semibold"
				/>
				<p
					className={cn(
						"text-sm",
						isStale ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{isStale ? "Telemetry stale" : "Reporting normally"}
				</p>
			</CardContent>
		</Card>
	);
}
