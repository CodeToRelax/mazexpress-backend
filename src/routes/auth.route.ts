import { AuthController } from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// reset password
router.patch('/:id/resetPassword', async (req, res) => {
  try {
    const results = await AuthController.resetUserPassword(req.params.id, 'newPassword');
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
