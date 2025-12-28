import { Request, Response} from 'express';
export const index = (req: Request, res: Response): void => {
    // console.log(req.body);
    res.json({
        location: req.body.file
    })
    // res.send('Upload Controller Admin');
}