import { model, models, Schema } from 'mongoose';
const resourceSchema=new Schema({
       driveUrl:{
        type:String,
        required:true,
       } ,
       semester:{
        type:String,
        required:true,
       } ,
       category:{
        type:String,
        required:true,
       },
       subject:{
        type:String,
        required:true,
       },
       name:{
        type:String,
        required:true,
       }
})
export const Resource=models.Resource || model('Resource',resourceSchema)