import asyncHandler from 'express-async-handler';
import Raport from '../models/raportModel.js';
import User from '../models/userModel.js';

import RaportValidator from '../validator/raport/index.js';

const createNewRaport = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (user.role !== 'mentor') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { chapter, verse, status, detail, username } = req.body;

  RaportValidator.validateRaportPayload({
    chapter,
    verse,
    status,
    detail,
    username,
  });

  const student = await User.findOne({ username }).select('-password');

  if (!student) {
    return res.status(400).json({ message: 'invalid body request' });
  }

  if (status) {
    student.success += 1;
  } else {
    student.fail += 1;
  }

  student.poin = student.success * 3 + student.fail;

  await student.save();

  const raport = new Raport({
    chapter,
    verse,
    status,
    detail,
    studentId: student._id,
  });

  await raport.save();

  res.status(201).json({ message: `New raport created` });
});

const getRaportsByStudentId = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const username = req.params.username;

  const student = await User.findOne({ username });

  if (!student) {
    return res.status(404).json({ message: 'student is not found' });
  }

  const user = await User.findById(userId);

  if (user.role === 'mentor') {
    if (user._id.toString() !== student.mentorId.toString()) {
      return res.status(401).json({ message: 'unauthorized' });
    }
  } else if (user._id.toString() !== student._id.toString()) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  const studentId = student._id.toString();

  const raports = await Raport.find({ studentId });

  res.json({ raports });
});

const deleteRaportById = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { raportId } = req.params;

  const raport = await Raport.findById(raportId);

  const student = await User.findById(raport.studentId);

  if (!student) {
    return res.status(400).json({ message: 'Unauthorized' });
  }

  if (student.mentorId.toString() !== userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!raport) {
    return res.status(400).json({ message: 'raport not found' });
  }

  if (raport.status) {
    student.success -= 1;
  } else {
    student.fail -= 1;
  }

  student.poin = student.success * 3 + student.fail;

  await student.save();

  await raport.deleteOne();

  res.json({ message: 'raport deleted' });
});

export { createNewRaport, getRaportsByStudentId, deleteRaportById };
