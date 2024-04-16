import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const raportSchema = new Schema(
  {
    chapter: {
      type: Number,
      required: true,
    },
    verse: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Validasi custom untuk memastikan jumlah item dalam koleksi tidak melebihi batas
raportSchema.pre('save', async function (next) {
  const raportCount = await mongoose.models.Raport.countDocuments({
    studentId: this.studentId,
  });
  if (raportCount >= 365) {
    const err = new Error(
      'Batas jumlah item dalam koleksi Raport telah tercapai'
    );
    next(err);
  } else {
    next();
  }
});

const Raport = mongoose.model('Raport', raportSchema);
export default Raport;
