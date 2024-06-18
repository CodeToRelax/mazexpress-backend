import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { checkUserRules } from '@/utils/helpers';
// import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
// import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest, IGetAllUsersFilters } from '@/utils/types';
import { createUserValidation, toggleUserValidation } from '@/validation/auth.validation';
import { AdminUpdateUserValidation, UpdateProfileValidation, deleteUserValidation } from '@/validation/user.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods user service--- //

// (admin)
router.get('/getAllUsers', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  const { page } = req.query;
  try {
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: 10,
    };
    const filters = { ...req.query };
    delete filters.page;
    delete filters.sort;
    delete filters.limit;

    const results = await UserController.getAllUsers(paginationOptions, filters as unknown as IGetAllUsersFilters);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.get('/getAllUsersUnpaginated', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    const results = await UserController.getAllUsersUnpaginated();
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// TODO get a single user (admin/customer) (breaking changes)
router.get('/:id', async (req: CustomExpressRequest, res) => {
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    // const hasValidRules = await checkUserRules(req.user?.acl, req);
    // if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

    const results = await UserController.getUser(req.params.id);
    return res.status(200).json(results);
  } catch (error) {
    throw new CustomErrorHandler(404, 'common.error', 'common.userNotFound', error);
  }
});

// (admin)
router.post('/createUser', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    // validate body
    const { error } = createUserValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    // start signup process
    const user = await AuthController.createUser(req.body, req.body.userType);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// toggle user (admin)
router.patch('/toggleUser', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    // validate body
    const { error } = toggleUserValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const results = await UserController.toggleUser(req.body.firebaseId, req.body.status);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// update user (admin)
router.patch('/updateUser/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    // validate body
    const { error } = AdminUpdateUserValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const filter = { _id: req.params.id };
    const results = await UserController.updateUser(filter, req.body);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// all users using their Id from JWT (TODO)
router.patch('/updateProfile', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  try {
    // validate body
    const { error } = UpdateProfileValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const results = await UserController.updateUser({ _id: req.user?.mongoId }, req.body);
    return res.status(200).json(results); // TODO profile update message
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// delete user (admin)
router.delete('/deleteUser', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    const { error } = deleteUserValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const results = await UserController.deleteUser(req.body.mongoId, req.body.firebaseId);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
