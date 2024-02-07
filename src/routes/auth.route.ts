import { AuthController } from '@/controllers/auth.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { validateLibyanNumber } from '@/utils/helpers';
import { signupValidation } from '@/validation/auth.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// create user
router.post('/signUp', async (req, res) => {
  try {
    // validate body
    const { error } = signupValidation.validate(req.body);
    if (error) throw new CustomErrorHandler(403, 'common.error', error.details[0].message, error);
    if (!validateLibyanNumber(req.body.phoneNumber))
      throw new CustomErrorHandler(403, 'common.error', 'common.badPhoneNumber', error);

    // start signup process
    const user = await AuthController.signUp(req.body);
    return res.status(201).json(user);
  } catch (error) {
    throw new CustomErrorHandler(500, 'unexpected', 'An unexpected error occurred', error);
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

// // toggle user
// router.patch('/:id/toggleUser', async (req, res) => {
//   try {
//     const results = await AuthController.toggleUser(req.params.id, 'enable');
//     return res.status(200).json(results);
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({
//       comment: 'error',
//     });
//     // throw error (erorr handler)
//   }
// });

export default router;
