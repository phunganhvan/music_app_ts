
import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";
import { UserRoute } from "./user.route";
import * as userMiddleware from "../../middlewares/client/user.middleware";
import FavoriteSong from "../../models/favorite-song.model";
import { favoriteSongRouter } from "./favoriteSong.route";

const ClientRoute = (app: Express): void => {
   
    app.use(userMiddleware.infoUser);
    
    app.use(`/topics`, TopicRoute);
    app.use('/songs', SongRoute);
    app.use('/user', UserRoute);
    app.use('/favorite-songs', favoriteSongRouter);
}

export default ClientRoute;