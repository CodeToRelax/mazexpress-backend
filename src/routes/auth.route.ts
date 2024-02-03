import { AuthController } from '@/controllers/auth.controller';
import { mockUserAdmin } from '@/mocks/data/user';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// create user
router.post('/signUp', async (req, res) => {
  // const user = await UserController.createUser(req.body);
  const results = await AuthController.createUser(mockUserAdmin);
  return res.status(201).json(results); // res handler
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
