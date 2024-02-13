import { AuthController } from '@/controllers/auth.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { validateLibyanNumber } from '@/utils/helpers';
import { UserTypes } from '@/utils/types';
import { signupValidation, toggleUserValidation } from '@/validation/auth.validation';
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
    if (!validateLibyanNumber(req.body.phoneNumber)) return res.status(403).json(error); // update to validation error custom
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

// // reset password
// router.patch('/:id/resetPassword', async (req, res) => {
//   try {
//     const results = await AuthController.adminResetUserPassword(req.params.id, 'newPassword');
//     return res.status(200).json(results);
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({
//       comment: 'error',
//     });
//     // throw error (erorr handler)
//   }
// });

// toggle user
router.patch('/toggleUser', async (req, res) => {
  try {
    // validate body
    const { error } = toggleUserValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const results = await AuthController.toggleUser(req.body.firebaseId, req.body.status);
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
