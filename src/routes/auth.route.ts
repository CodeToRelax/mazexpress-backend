import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { UserTypes } from '@/utils/types';
import { signupValidation, updateAclValidation } from '@/validation/auth.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// create user
router.post('/signUp', async (req, res) => {
  try {
    // validate body
    const { error } = signupValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    // start signup process
    const user = await AuthController.createUser(req.body, UserTypes.CUSTOMER);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// get user acl
router.get('/acl/:id', async (req, res) => {
  try {
    const user = await UserController.getUser(req.params.id);
    return res.status(200).json(user?.acl);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// update user acl
router.patch('/acl', async (req, res) => {
  try {
    // validate body
    const { error } = updateAclValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const user = await AuthController.updateUserAcl(req.body.userId, req.body.rules);
    return res.status(200).json(user?.acl);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
