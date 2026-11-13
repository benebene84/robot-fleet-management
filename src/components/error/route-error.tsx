import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";

export function RouteError({ error, reset }: ErrorComponentProps) {
	const router = useRouter();

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-2 p-6">
			<h1 className="text-2xl font-semibold">Something went wrong</h1>
			<p className="text-muted-foreground">
				{error instanceof Error
					? error.message
					: "An unexpected error occurred."}
			</p>
			<button
				type="button"
				className="text-sm underline underline-offset-4"
				onClick={() => {
					reset();
					router.invalidate();
				}}
			>
				Try again
			</button>
		</main>
	);
}
