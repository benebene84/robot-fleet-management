import { Skeleton } from "#/components/ui/skeleton";

export function FleetOverviewSkeleton() {
	return (
		<main
			className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6"
			aria-busy
		>
			<Skeleton className="h-8 w-24" />
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-8 w-40" />
			</div>
			<Skeleton className="h-72" />
		</main>
	);
}
