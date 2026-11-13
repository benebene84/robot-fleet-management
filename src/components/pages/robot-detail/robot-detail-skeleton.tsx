import { Skeleton } from "#/components/ui/skeleton";

export function RobotDetailSkeleton() {
	return (
		<main
			className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6"
			aria-busy
		>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<Skeleton className="h-40" />
				<Skeleton className="h-40" />
				<Skeleton className="h-40" />
			</div>
			<Skeleton className="h-56" />
		</main>
	);
}
