import { STATUS_LABELS } from "#/components/shared/status-badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import type { FleetFilter } from "#/domain/fleet";
import { allRobotStatuses, type RobotStatus } from "#/domain/robot";
import type { Site } from "#/domain/site";

const ALL = "all";

type FleetFiltersProps = {
	sites: Site[];
	filter: FleetFilter;
	statusCounts: Record<RobotStatus, number>;
	onFilterChange: (filter: FleetFilter) => void;
};

export function FleetFilters({
	sites,
	filter,
	statusCounts,
	onFilterChange,
}: FleetFiltersProps) {
	const siteItems = [
		{ value: ALL, label: "All sites" },
		...sites.map((site) => ({ value: site.id, label: site.name })),
	];
	const statusItems = [
		{ value: ALL, label: "All statuses" },
		...allRobotStatuses.map((status) => ({
			value: status,
			label: `${STATUS_LABELS[status]} (${statusCounts[status]})`,
		})),
	];

	return (
		<div className="flex flex-wrap gap-2">
			<Select
				items={siteItems}
				value={filter.siteId ?? ALL}
				onValueChange={(value) =>
					onFilterChange({
						...filter,
						siteId: value === ALL || value === null ? undefined : value,
					})
				}
			>
				<SelectTrigger aria-label="Filter by site" className="min-w-48 bg-card">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{siteItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				items={statusItems}
				value={filter.status ?? ALL}
				onValueChange={(value) =>
					onFilterChange({
						...filter,
						status:
							value === ALL || value === null
								? undefined
								: (value as RobotStatus),
					})
				}
			>
				<SelectTrigger
					aria-label="Filter by status"
					className="min-w-40 bg-card"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{statusItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
