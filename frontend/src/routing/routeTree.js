import { createRootRoute } from "@tanstack/react-router";
import { homePageRoute } from "./homepage.js";
import { authRoute } from "./authRoute.js";
import { dasboardRouteTree } from "./dashboard.js";
import { vaultDirectRoute, vaultPrefixRoute } from "./vaultRoute.js";
import App from "../App.jsx";

export const rootRoute = createRootRoute({
  component: App,
});

export const routeTree = rootRoute.addChildren([
  homePageRoute,
  authRoute,
  dasboardRouteTree,
  vaultPrefixRoute,
  vaultDirectRoute,
]);