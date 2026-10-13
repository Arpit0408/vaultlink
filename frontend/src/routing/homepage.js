import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree.js";
import HomePage from "../pages/HomePage.jsx";

export const homePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});