import { MapPinIcon, Navigation2Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { APP_LOCALE } from "#/constants/locale";
import type { Position } from "#/domain/robot";

const metres = new Intl.NumberFormat(APP_LOCALE, {
	style: "unit",
	unit: "meter",
	maximumFractionDigits: 1,
});

type PositionCardProps = {
	position: Position;
	siteName: string;
};

export function PositionCard({ position, siteName }: PositionCardProps) {
	const heading = Math.round(position.heading);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<MapPinIcon className="size-4" />
					Position
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-3xl font-semibold tabular-nums">
					{metres.format(position.x)}, {metres.format(position.y)}
				</p>
				<p className="flex items-center gap-2 text-sm text-muted-foreground">
					{/* The icon points up (heading 90°); CSS rotates clockwise, headings run counter-clockwise. */}
					<Navigation2Icon
						className="size-4 transition-transform"
						style={{ transform: `rotate(${90 - heading}deg)` }}
						aria-hidden
					/>
					Heading {heading}° · {siteName}
				</p>
			</CardContent>
		</Card>
	);
}
