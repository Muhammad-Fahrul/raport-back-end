import express from 'express';
const router = express.Router();

import {
  createNewStudent,
  deleteStudentById,
  getStudentsByMentorId,
} from '../controllers/studentController.js';
import verifyJWT from '../middleware/verifyJWT.js';

router.use(verifyJWT);
router
  .route('/')
  .post(createNewStudent)
  .get(getStudentsByMentorId)
  .delete(deleteStudentById);

export default router;
