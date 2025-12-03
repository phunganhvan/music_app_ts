console.log("Welcome to the Music App!");


// localhost:3000/topics chủ đề bài hát

import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as database from './config/database';
import ClientRoute from './routes/client/index.route';

dotenv.config();
// config env

// kết nối database
database.connect();



const app : Express = express();
const port: number | String = process.env.PORT || 3000;

app.set(`views`, `./views`);

app.set(`view engine`, `pug`);


// Client Routes
ClientRoute(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});