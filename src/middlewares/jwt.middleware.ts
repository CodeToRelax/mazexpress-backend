import { fbAuth } from '@/servers/firebase.server';
import { NextFunction, Request, Response } from 'express';

const AuthenticateFbJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const idToken = authHeader.split(' ')[1];

    try {
      await fbAuth.verifyIdToken(idToken);
      return next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
    // admin
    //   .auth()
    //   .verifyIdToken(idToken)
    //   .then(function (decodedToken) {
    //     return next();
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     return res.sendStatus(403);
    //   });
  } else {
    res.sendStatus(401);
  }
};

export default AuthenticateFbJWT;
