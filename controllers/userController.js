import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';

import firebaseConfig from '../config/firebase.js';

import UserValidator from '../validator/user/index.js';

initializeApp(firebaseConfig);

const storage = getStorage();

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  UserValidator.validateUserPayload({ username, password });

  let user = await User.findOne({ username });

  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  user = new User({
    username,
    password,
    role: 'mentor',
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username }).select('-password');

  if (!user) {
    return res.status(400).json({ message: 'User is not found' });
  }

  res.json({ ...user._doc });
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { phone, oldPassword, newPassword } = req.body;

  UserValidator.validateUserUpdatePayload({ phone, oldPassword, newPassword });

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  user.phone = phone;

  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  await user.save();

  res.json({ message: `${user.username} update successfully` });
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File tidak ditemukan' });
  }

  const userId = req.userId; // Anda perlu menyertakan ID pengguna di body permintaan

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const file = req.file;

  const fileName = `${userId}.jpg`; // Nama file tetap dengan ekstensi .jpg

  // Simpan foto ke Firebase Storage
  const storageRef = ref(storage, `profile_photos/${fileName}`);
  const snapshot = await uploadBytesResumable(storageRef, file.buffer);

  // Ambil URL foto yang di-upload
  const downloadURL = await getDownloadURL(snapshot.ref);

  // Simpan URL foto profil baru ke basis data pengguna atau tempat penyimpanan yang sesuai
  // Misalnya, di sini kita mengembalikan URL foto sebagai respons

  user.urlImgProfile = downloadURL;

  await user.save();

  res.json({ message: 'foto profil berhasil diperbarui' });
});

export { createNewUser, getUser, updateUser, updateProfilePhoto };
