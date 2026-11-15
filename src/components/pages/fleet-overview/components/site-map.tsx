import { Link } from "@tanstack/react-router";
import {
	STATUS_FILL,
	STATUS_LABELS,
} from "#/components/shared/status-appearance";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	getAttentionReasons,
	getEffectiveStatus,
	type Robot,
} from "#/domain/robot";
import type { Site } from "#/domain/site";
import { cn } from "#/lib/utils";

const GRID_STEP_M = 5;

type SiteMapProps = {
	site: Site;
	robots: Robot[];
	now: Date;
};

export function SiteMap({ site, robots, now }: SiteMapProps) {
	const { width, height } = site.dimensions;
	// Marker sizes scale with the site so they look the same on every map.
	const unit = Math.max(width, height) / 40;

	const gridX = Array.from(
		{ length: Math.floor(width / GRID_STEP_M) },
		(_, i) => (i + 1) * GRID_STEP_M,
	);
	const gridY = Array.from(
		{ length: Math.floor(height / GRID_STEP_M) },
		(_, i) => (i + 1) * GRID_STEP_M,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{site.name}</CardTitle>
				<CardDescription>
					{width} × {height} m ·{" "}
					{robots.length === 1 ? "1 robot" : `${robots.length} robots`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="w-full rounded-lg bg-muted/50"
				>
					<title>{`Map of ${site.name}`}</title>
					{gridX.map((x) => (
						<line
							key={`x-${x}`}
							x1={x}
							x2={x}
							y1={0}
							y2={height}
							className="stroke-border"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					{gridY.map((y) => (
						<line
							key={`y-${y}`}
							x1={0}
							x2={width}
							y1={y}
							y2={y}
							className="stroke-border"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					{robots.map((robot) => {
						const status = getEffectiveStatus(robot, now);
						const needsAttention = getAttentionReasons(robot, now).length > 0;
						// Telemetry has its origin bottom-left with y pointing up; SVG has y pointing down.
						const cx = robot.position.x;
						const cy = height - robot.position.y;
						const heading = (robot.position.heading * Math.PI) / 180;
						const labelOnLeft = cx > width * 0.75;

						return (
							<Link
								key={robot.id}
								to="/robots/$robotId"
								params={{ robotId: robot.id }}
								search={(prev) => prev}
								className="outline-none focus-visible:[&_circle]:stroke-ring"
							>
								<title>{`${robot.name} · ${STATUS_LABELS[status]}`}</title>
								{needsAttention && (
									<circle
										cx={cx}
										cy={cy}
										r={unit * 1.5}
										className="fill-none stroke-destructive"
										strokeWidth={unit * 0.25}
									/>
								)}
								<line
									x1={cx}
									y1={cy}
									x2={cx + Math.cos(heading) * unit * 2}
									y2={cy - Math.sin(heading) * unit * 2}
									className="stroke-foreground/60"
									strokeWidth={unit * 0.25}
									strokeLinecap="round"
								/>
								<circle
									cx={cx}
									cy={cy}
									r={unit * 0.9}
									className={cn(STATUS_FILL[status], "stroke-card")}
									strokeWidth={unit * 0.2}
								/>
								<text
									x={labelOnLeft ? cx - unit * 2 : cx + unit * 2}
									y={cy + unit * 0.5}
									textAnchor={labelOnLeft ? "end" : "start"}
									fontSize={unit * 1.4}
									className="fill-foreground"
								>
									{robot.name}
								</text>
							</Link>
						);
					})}
				</svg>
			</CardContent>
		</Card>
	);
}
