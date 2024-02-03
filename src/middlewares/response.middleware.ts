import { Request, Response } from 'express';

const ResponseHandler = async (_req: Request, res: Response) => {
  console.log(res.locals.data); // data to minipulate
  return res.status(200).json(res.locals.data);
};

export default ResponseHandler;
