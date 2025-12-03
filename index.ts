console.log("Welcome to the Music App!");


// localhost:3000/topics chủ đề bài hát

import express, { Express, Request, Response } from 'express';
const app : Express = express();
const port: number =3000;

app.get('/topics', (req: Request, res: Response) => {
    res.send('Danh sách các chủ đề bài hát');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});