import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['mentor', 'student'],
    required: true,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  urlImgProfile: {
    type: String,
    default: null,
  },
  success: {
    type: Number,
    default: 0,
    min: 0,
  },
  fail: {
    type: Number,
    default: 0,
    min: 0,
  },
  poin: {
    type: Number,
    default: 0,
    min: 0,
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const studentCount = await mongoose.models.User.countDocuments({
      mentorId: this.mentorId,
    });
    if (studentCount >= 40) {
      const err = new Error(
        'Batas jumlah item dalam koleksi Student telah tercapai'
      );
      next(err);
    } else {
      next();
    }
  }
});
const User = mongoose.model('User', UserSchema);

export default User;
