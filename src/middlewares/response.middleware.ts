import { Request, Response } from 'express';

const ResponseHandler = async (_req: Request, res: Response) => {
  const reponseBody = {
    title: res.locals.title,
    description: res.locals.description,
    data: res.locals.data,
  };
  return res.status(res.locals.statusCode).json(reponseBody);
};

export default ResponseHandler;
