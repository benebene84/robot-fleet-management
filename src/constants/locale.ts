// All formatting uses one fixed locale. Falling back to the runtime default would format
// differently on the server and in the browser and break hydration.
export const APP_LOCALE = "en";
