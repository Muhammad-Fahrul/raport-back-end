import express from 'express';
const router = express.Router();

import {
  createNewUser,
  getUser,
  updateProfilePhoto,
  updateUser,
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import verifyJWT from '../middleware/verifyJWT.js';

router.post('/', createNewUser);
router.route('/:username').get(verifyJWT, getUser);
router.post(
  '/uploadProfilePhoto',
  upload.single('file'),
  verifyJWT,
  updateProfilePhoto
);
router.put('/', verifyJWT, updateUser);

export default router;
