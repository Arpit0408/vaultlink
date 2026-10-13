import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import VaultAccessPage from "../features/vault/VaultAccessPage.jsx";

export const vaultDirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$shortcode",
  component: VaultAccessPage,
});

export const vaultPrefixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/v/$shortcode",
  component: VaultAccessPage,
});
