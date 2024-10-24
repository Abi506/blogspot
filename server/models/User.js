const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unqiue:true
    },
    email:{
        type:String,
        required:true,
        unqiue:true 
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    },
    aboutMe:{
        type:String,
        require:false
    }
},{
    timestamps:true
})

module.exports=mongoose.model("User",userSchema)