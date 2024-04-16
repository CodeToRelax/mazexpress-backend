import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { UserTypes } from '@/utils/types';
import { createUserValidation, toggleUserValidation } from '@/validation/auth.validation';
import { AdminUpdateUserValidation, UpdateProfileValidation, deleteUserValidation } from '@/validation/user.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods user service--- //

// (admin)
router.get('/getAllUsers', async (req, res) => {
  const { page } = req.query;
  try {
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: 10,
    };
    const results = await UserController.getAllUsers(paginationOptions, req.query.userType as UserTypes);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// get a single user (admin/customer)
router.get('/:id', async (req, res) => {
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const results = await UserController.getUser(req.params.id);
    return res.status(200).json(results);
  } catch (error) {
    throw new CustomErrorHandler(404, 'common.error', 'common.userNotFound', error);
  }
});

// (admin)
router.post('/createUser', async (req, res) => {
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

// toggle user
router.patch('/toggleUser', async (req, res) => {
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
router.patch('/updateUser/:id', async (req, res) => {
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

// update user profile (for cutsomers)
// TODO check jwt id
router.patch('/updateProfile', async (req, res) => {
  try {
    // validate body
    const { error } = UpdateProfileValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const results = await UserController.updateUser({ _id: '' }, req.body);
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
router.delete('/deleteUser', async (req, res) => {
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
