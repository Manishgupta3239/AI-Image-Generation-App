import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";
dotenv.config();

const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

router.get('/',async(req,res)=>{
    try {
        const posts = await Post.find({});
        res.status(200).json({success:true , data:posts});
       
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false , message:error});
    }
});

router.post("/", async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    // Upload an image
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
        name,
        prompt,
        photo : photoUrl.url
    });
    res.status(200).json({success:true , data:newPost});
} catch (error){
    console.log(error.message);
    res.status(500).json({success:false , message:error});
}
});

export default router;