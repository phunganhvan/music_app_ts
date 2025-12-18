import { Express } from "express";
import { DashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { TopicRoutes } from "./topic.route";
import { SongRoutes } from "./song.route";

const AdminRoute = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`;
    app.use( `${PATH_ADMIN}/dashboard`, DashboardRoutes);

    app.use(`${PATH_ADMIN}/topic`, TopicRoutes);

    app.use(`${PATH_ADMIN}/song`, SongRoutes);
}

export default AdminRoute;