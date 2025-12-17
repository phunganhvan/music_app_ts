import { Express } from "express";
import { DashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";

const AdminRoute = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`;
    app.use( `${PATH_ADMIN}/dashboard`, DashboardRoutes);
}

export default AdminRoute;