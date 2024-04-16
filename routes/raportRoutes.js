import express from 'express';
const router = express.Router();

import verifyJWT from '../middleware/verifyJWT.js';
import {
  createNewRaport,
  getRaportsByStudentId,
  deleteRaportById,
} from '../controllers/raportController.js';

router.use(verifyJWT);

router.route('/').post(createNewRaport);
router.route('/:username').get(getRaportsByStudentId);
router.route('/:raportId').delete(deleteRaportById);

export default router;
