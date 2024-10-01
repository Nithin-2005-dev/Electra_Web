import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const uploadImgSchema=new Schema({
    title: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true 
      },
      cloudinaryId: {
        type: String, 
        required: true
      },
      imageAlt: {
        type: String,
        default: 'Image uploaded'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      category:{
        type:String,
        required:true
      }
});

const UploadImg=model("UploadImg",uploadImgSchema);

export default UploadImg;