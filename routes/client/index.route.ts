
import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";

const ClientRoute = (app: Express): void => {
    
    app.use(`/topics`, TopicRoute);
    app.use('/songs', SongRoute)
}

export default ClientRoute;