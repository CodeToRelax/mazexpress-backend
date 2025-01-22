import { CustomExpressRequest } from '@/utils/types';
import { fbAuth } from '..';
import { NextFunction, Response } from 'express';
import UserCollection from '@/models/user.model';

const AuthenticateFbJWT = async (req: CustomExpressRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const idToken = authHeader.split(' ')[1];
    try {
      const decodedToken = await fbAuth.verifyIdToken(idToken);
      const mongoUser = await UserCollection.findById({ _id: decodedToken.mongoId });
      req.user = decodedToken;
      req.user.acl = mongoUser!.acl;
      return next();
    } catch (error) {
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

export default AuthenticateFbJWT;
