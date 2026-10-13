import express from "express";
import authRoutes from "./auth.routes.js";
import urlRoutes from "./url.routes.js";
import vaultRoutes from "./vault.routes.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/urls", urlRoutes);
apiRouter.use("/create", urlRoutes);
apiRouter.use("/vault", vaultRoutes);

export default apiRouter;
