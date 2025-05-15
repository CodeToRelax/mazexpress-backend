// *OK*

import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, StatusCode } from '@/utils/types';
import { createUserValidation, updateAclValidation } from '@/validation/auth.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// create user (anyone)
router.post('/signUp', ValidateRequest(createUserValidation), async (req, res) => {
  const user = await AuthController.createUser(req.body);
  return res.status(StatusCode.SUCCESS_CREATED).json(user);
});

// get user acl (Mohamed-Ali-Zeo only)
router.get('/acl/:id', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const user = await UserController.getUser(req.params.id);
    return res.status(StatusCode.SUCCESS_OK).json(user?.acl);
  } catch (error) {
    return error instanceof CustomErrorHandler
      ? error
      : new CustomErrorHandler(
          StatusCode.SERVER_ERROR_INTERNAL,
          'internalServerError',
          'Internal server error occured please reach to support',
          error
        );
  }
});

// update user acl (Mohamed-Ali-Zeo only)
router.patch(
  '/acl',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateAclValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const user = await AuthController.updateUserAcl(req.body.userId, req.body.rules);
      return res.status(200).json(user?.acl);
    } catch (error) {
      return error instanceof CustomErrorHandler
        ? error
        : new CustomErrorHandler(
            StatusCode.SERVER_ERROR_INTERNAL,
            'internalServerError',
            'Internal server error occured please reach to support',
            error
          );
    }
  }
);

export default router;
