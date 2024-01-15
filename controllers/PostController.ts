import Post from "../models/Post";
import { Request,Response } from "express";

class PostController{
    public static async createPost(req:Request,res:Response){
       try {
        const isPost=await Post.findOne({_id:req.body.id});
        if (!isPost){
            const newPost=new Post(req.body);
            await newPost.save();
            res.status(200).json({'msg':'Post kaydı başarılı'})
        }

        else{
            res.status(403).json({'msg':'Bu post kayıtlı zaten'})
        }
       } catch (error) {
          res.status(500).json(error);
       }
    } 
}

export default PostController;