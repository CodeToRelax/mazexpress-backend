import { UserController } from '@/controllers/user.controller';
import { Router } from 'express';
import { mockUser, mockUserUpdate } from '@/mocks/data/user';

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
  try {
    const results = await UserController.getUser(req.params.id);
    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

// create user
router.post('/', async (req, res) => {
  try {
    // const user = await UserController.createUser(req.body);
    const results = await UserController.createUser(mockUser);
    return res.status(201).json(results);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      comment: 'error',
    });
    // throw error (erorr handler)
  }
});

// update user
router.patch('/:id', async (req, res) => {
  try {
    const results = await UserController.updateUser(req.params.id, mockUserUpdate);
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
