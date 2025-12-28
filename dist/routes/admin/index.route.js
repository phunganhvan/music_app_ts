"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const config_1 = require("../../config/config");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const upload_route_1 = require("./upload.route");
const AdminRoute = (app) => {
    const PATH_ADMIN = `${config_1.systemConfig.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, dashboard_route_1.DashboardRoutes);
    app.use(`${PATH_ADMIN}/topic`, topic_route_1.TopicRoutes);
    app.use(`${PATH_ADMIN}/song`, song_route_1.SongRoutes);
    app.use(`${PATH_ADMIN}/upload`, upload_route_1.UploadRoutes);
};
exports.default = AdminRoute;
