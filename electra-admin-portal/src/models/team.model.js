import mongoose from "mongoose";
const teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },publicId:{
        type:String,
    },insta:{
        type:String,
    },fb:{
        type:String,
    },linkdin:{
        type:String,
    },
})
export const Team=mongoose.models.Team || mongoose.model('Team',teamSchema);