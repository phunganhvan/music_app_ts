
import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";
import { UserRoute } from "./user.route";

const ClientRoute = (app: Express): void => {
    
    app.use(`/topics`, TopicRoute);
    app.use('/songs', SongRoute);
    app.use('/user', UserRoute);
}

export default ClientRoute;