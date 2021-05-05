import express from 'express';
import { getUsers, getUser, createUser, updateUser } from '../controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getUser);
router.post('/', createUser)
router.patch('/:id', updateUser)

export default router;