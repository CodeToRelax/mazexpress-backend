// *OK*

import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, IGetAllUsersFilters, StatusCode } from '@/utils/types';
import { createUserValidation, toggleUserValidation } from '@/validation/auth.validation';
import { AdminUpdateUserValidation, UpdateProfileValidation, deleteUserValidation } from '@/validation/user.validation';
import { Router } from 'express';
import { PaginateOptions } from 'mongoose';

const router = Router({
  caseSensitive: true,
});

// (admin)
router.get('/getAllUsers', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page: _p, limit: _l, sort: _s, paginate, ...rawFilters } = req.query;

    // Extract pagination options with defaults
    const page = parseInt(_p as string, 10) || 1;
    const limit = parseInt(_l as string, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions: PaginateOptions = {
      page,
      limit,
      sort,
      pagination: !!paginate,
      lean: true, // return plain JS objects
    };
    const filters = rawFilters as unknown as IGetAllUsersFilters;

    // return paginated response
    const results = await UserController.getAllUsers(paginationOptions, filters);
    return res.status(StatusCode.SUCCESS_OK).json(results);
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

// (admin) TODO update this
router.get('/getAllUsersUnpaginated', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page: _p, limit: _l, sort: _s, ...rawFilters } = req.query;

    // Extract pagination options with defaults
    const page = parseInt(_p as string, 10) || 1;
    const limit = parseInt(_l as string, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions: PaginateOptions = {
      page,
      limit,
      sort,
      pagination: false,
      lean: true, // return plain JS objects
    };
    const filters = rawFilters as unknown as IGetAllUsersFilters;

    // return paginated response
    const results = await UserController.getAllUsers(paginationOptions, filters);
    return res.status(StatusCode.SUCCESS_OK).json(results);
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

// (admin)
router.get('/getUser/:id', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const results = await UserController.getUser(req.params.id);
    return res.status(StatusCode.SUCCESS_OK).json(results);
  } catch (error) {
    throw new CustomErrorHandler(StatusCode.CLIENT_ERROR_NOT_FOUND, 'common.error', 'Requested used not found.', error);
  }
});

// (admin)
router.post(
  '/createUser',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createUserValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const user = await AuthController.createUser(req.body);
      return res.status(StatusCode.SUCCESS_CREATED).json(user);
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

// toggle user (admin)
router.patch(
  '/toggleUser',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(toggleUserValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const results = await UserController.toggleUser(req.body.firebaseId, req.body.status);
      return res.status(StatusCode.SUCCESS_OK).json(results);
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

// update user (admin)
router.patch(
  '/updateUser/:id',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(AdminUpdateUserValidation),
  async (req: CustomExpressRequest, res) => {
    if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    try {
      const filter = { _id: req.params.id };
      const results = await UserController.updateUser(filter, req.body);
      return res.status(StatusCode.SUCCESS_OK).json(results);
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

// update profile using their Id from JWT
router.patch(
  '/updateProfile',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(UpdateProfileValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const results = await UserController.updateUser({ _id: req.user?.mongoId }, req.body);
      return res.status(StatusCode.SUCCESS_OK).json(results);
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

// delete user (admin)
router.delete(
  '/deleteUser',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(deleteUserValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const results = await UserController.deleteUser(req.body.mongoId, req.body.firebaseId);
      return res.status(StatusCode.SUCCESS_OK).json(results);
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
