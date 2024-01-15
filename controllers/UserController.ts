import User from "../models/User";
import { Request,Response} from "express";
import bcrypt from "bcrypt"


interface authRequest extends Request{
    user?:any,
}

class UserController{
   public static async updateUser(req:authRequest,res:Response){
     
       if (req.body.userId==req.params.id || req.user.isAdmin){
           if (req.body.password){
              try {
                req.body.password=await bcrypt.hash(req.body.password,12);
              } catch (error) {
                 res.status(500).json(error)
              }

              try {
                 const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body})
                 
                 res.status(200).json({'mssg':`${user} Hesap güncellendi`});
                  
                 
              } catch (error) {
                 res.status(500).json(error);
              }
           }
       }

       else{
           res.status(500).json({'msg':'Kullanıcı sadece kendi hesabını güncelleyebilir'})
       }
   }

   public static async deleteUser(req:authRequest,res:Response){
       if (req.body.userId == req.params.id || req.user.isAdmin){
           if (req.body.password){
                try {
                   const deleteUser=await User.findByIdAndDelete({_id:req.params.id});
                   res.status(200).json({'msg':`${deleteUser} kişisi silindi`});
                } catch (error) {
                   res.status(500).json(error);
                }
           }
       }
       else{
         res.status(500).json({'msg':'Kullanıcı sadece kendini silebilir'})
       }
   }

   public static async getUser(req:authRequest,res:Response){
        
              try {
                const user=await User.findById({_id:req.params.id});
                res.status(200).json({'msg':`${user} kişisi getirildi`});
              } catch (error) {
                  res.status(500).json(error);
              }
         
   }
}

export default UserController;