console.log("Welcome to the Music App!");


// localhost:3000/topics chủ đề bài hát

import express, { Express } from 'express';
import dotenv from 'dotenv';
import * as database from './config/database';
import ClientRoute from './routes/client/index.route';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import methodOverride from 'method-override';
import moment from 'moment';
import AdminRoute from './routes/admin/index.route';
import { systemConfig } from './config/config';
import path from 'path';
dotenv.config();
// config env

// kết nối database
database.connect();



const app : Express = express();
const port: number | String = process.env.PORT || 3000;
app.use(cookieParser('keyboard cat'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());
app.use(express.static('public'));

//override method PATCH
app.use(methodOverride('_method'));

app.set(`views`, `./views`);
app.set(`view engine`, `pug`);
app.use(express.urlencoded({ extended: true }));

// tiny mce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


app.locals.moment = moment;


app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Client Routes
ClientRoute(app);
// Admin Routes
AdminRoute(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});