import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import DashboardPage from "../pages/DashboardPage.jsx";
import AllUrls from "../pages/AllUrl.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import FileVaultPage from "../pages/FileVaultPage.jsx";
import { checkAuth } from "../utils/helper.js";
import DashboardOverview from "../features/dashboard/components/DashboardOverview.jsx";

export const dasboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
  beforeLoad: checkAuth,
});

export const dashboardHome = createRoute({
  getParentRoute: () => dasboardRoute,
  path: "/",
  component: DashboardOverview,
});

export const dashboardFilesRoute = createRoute({
  getParentRoute: () => dasboardRoute,
  path: "/files",
  component: FileVaultPage,
});

export const dashboardUrlsRoute = createRoute({
  getParentRoute: () => dasboardRoute,
  path: "/allurls",
  component: AllUrls,
});

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dasboardRoute,
  path: "/settings",
  component: SettingsPage,
});

export const userProfile = createRoute({
  getParentRoute: () => dasboardRoute,
  path: "/profile",
  component: SettingsPage,
});

export const dasboardRouteTree = dasboardRoute.addChildren([
  dashboardHome,
  dashboardFilesRoute,
  dashboardUrlsRoute,
  dashboardSettingsRoute,
  userProfile,
]);