import express from "express";
import authRoutes from "./auth.routes.js";
import urlRoutes from "./url.routes.js";
import vaultRoutes from "./vault.routes.js";

import { createShortUrl } from "../controllers/url.controller.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/urls", urlRoutes);
apiRouter.post("/create", createShortUrl);
apiRouter.use("/create", urlRoutes);
apiRouter.use("/vault", vaultRoutes);

export default apiRouter;
