
import { Express } from "express";
import { TopicRoute } from "./topic.route";

const ClientRoute = (app: Express): void => {
    
    app.use(`/topics`, TopicRoute);
}

export default ClientRoute;