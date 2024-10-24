const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    photo:{
        type:String
    },
    username:{
        type:String,
        required:true
    },
    categories:{
        type:Array
    }
},
{
    timestamps:true  
})

module.exports=mongoose.model("Temp_blog",postSchema)