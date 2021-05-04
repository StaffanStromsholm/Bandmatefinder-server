import express from 'express';
const router = express.Router({mergeParams: true});
import { createComment } from '../controllers/comments.js';

//Comments Create
router.post("/", createComment);

export default router;