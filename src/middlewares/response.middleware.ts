import { NextFunction, Request, Response } from 'express';

const responseCleanUp = async (req: Request, res: Response, next: NextFunction) => {
  // check response type and clean up accordingly
};

export default responseCleanUp;
