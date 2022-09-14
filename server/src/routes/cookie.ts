// import express from 'express';
import { Request, Response, NextFunction } from 'express';
// const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const cookieget = (req: Request, res: Response, next: NextFunction) => {
    let cookie: string | undefined = undefined;
    // console.log('cookierouter',req.cookies);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (req.cookies) {cookie = req.cookies.cookieName;}
    if (cookie === undefined) {
      let randomNumber=Math.random().toString();
      randomNumber=randomNumber.substring(2,randomNumber.length);
      const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10));
      res.cookie('cookieName',randomNumber, { expires: farFuture });
      console.log('cookie created successfully', randomNumber);
    } else {
      console.log('cookie exists', cookie);
    } 
    next(); 
};

export default cookieget;
