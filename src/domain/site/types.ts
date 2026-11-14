export type SiteDimensions = {
	/** Metres along the x axis. */
	width: number;
	/** Metres along the y axis. */
	height: number;
};

export type Site = {
	id: string;
	name: string;
	dimensions: SiteDimensions;
};

/** How a robot refers to the site it is deployed at. */
export type SiteRef = Pick<Site, "id" | "name">;
