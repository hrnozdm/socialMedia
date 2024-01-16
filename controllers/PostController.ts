import Post from "../models/Post";
import { Request,Response } from "express";

class PostController{
    public static async createPost(req:Request,res:Response){
       try {
            const newPost=new Post(req.body);
            await newPost.save();
            res.status(200).json(newPost)
       } catch (error) {
          res.status(500).json(error);
       }
    }
    public static async updatePost(req:Request,res:Response){
        try {
            const post=await Post.findById(req.params.id);
            if (post?.id == req.body.userId){
                await Post.findByIdAndUpdate(post?.id,{$set:req.body})
                res.status(200).json({'msg':'Post güncellendi'});
            }

            else{
                res.status(403).json({'msg':'BU post size ait değil'})
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }
    public static async deletePost(req:Request,res:Response){
        try {
            const post=await Post.findById(req.params.id);
            if (post?.id == req.body.userId){
                await Post.findByIdAndDelete(post?.id)
                res.status(200).json({'msg':'Post silindi'});
            }

            else{
                res.status(403).json({'msg':'Bu post size ait değil'})
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }

    public static async likePost(req:Request,res:Response){
        try {

            const user=await Post.findById(req.params.id);
            const currentUser=await Post.findById(req.body.userId);
            if (user?.likes.includes(currentUser?.id)){
                await user.updateOne({$push:{likes:req.body.userId}})
                res.status(201).json({'msg':'Bu postu beğendiniz'});
            }
            else{
                await user?.updateOne({$pull:{likes:req.body.userId}})
                res.status(200).json({'msg':'Bu postu beğenmediniz'});
            }
           
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default PostController;