const express=require("express")
const router=express.Router()
const Contact=require("../models/contact")

router.post("/",async(req,res)=>{
    const {username,email,message}=req.body

    try{
        const response=await Contact.create({
            username:username,
            email:email,
            message:message  
        })
        console.log(response,'response in contact')
        res.json({msg:"Message Sent Sucessfully"})
    }
    catch(error){
        res.json({msg:error.message})
    }
})

module.exports=router