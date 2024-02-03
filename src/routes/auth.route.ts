import { AuthController } from '@/controllers/auth.controller';
import { signupValidation } from '@/validation/auth.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// create user
router.post('/signUp', async (req, res) => {
  //validating post body with joi
  // more error validation here needed
  const { error } = signupValidation.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const user = await AuthController.createUser(req.body);
  return res.status(201).json(user); // res handler
});

// reset password
router.patch('/:id/resetPassword', async (req, res) => {
  try {
    const results = await AuthController.adminResetUserPassword(req.params.id, 'newPassword');
    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

// toggle user
router.patch('/:id/toggleUser', async (req, res) => {
  try {
    const results = await AuthController.toggleUser(req.params.id, 'enable');
    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

export default router;
