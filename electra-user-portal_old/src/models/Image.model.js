import mongoose from "mongoose";
const uploadSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});
export const ImageUpload =
  mongoose.models.ImageUpload || mongoose.model("ImageUpload", uploadSchema);
