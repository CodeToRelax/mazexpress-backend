import { UserController } from '@/controllers/user.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods user service--- //

//get all users
router.get('/', async (req, res) => {
  try {
    const results = await UserController.getUsers();
    return res.status(201).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

// get a single user
router.get('/:id', async (req, res) => {
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const results = await UserController.getUser(req.params.id);
    return res.status(200).json(results);
  } catch (error) {
    throw new CustomErrorHandler(404, 'common.error', 'common.userNotFound', error);
  }
});

// update user
router.patch('/:id', async (req, res) => {
  try {
    const results = await UserController.updateUser(req.params.id, req.body);
    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  try {
    const results = await UserController.deleteUser(req.params.id);
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
