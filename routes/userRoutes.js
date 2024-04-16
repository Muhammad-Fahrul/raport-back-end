import express from 'express';
const router = express.Router();

import {
  getUser,
  updateProfilePhoto,
  updateUser,
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import verifyJWT from '../middleware/verifyJWT.js';
router.route('/:username').get(getUser);
router.post(
  '/uploadProfilePhoto',
  upload.single('file'),
  verifyJWT,
  updateProfilePhoto
);
router.put('/', verifyJWT, updateUser);

export default router;
