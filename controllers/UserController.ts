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

   public static async follow(req:Request,res:Response){
       if (req.params.id!=req.body.userId){
         try {
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if (!user?.followers.includes(currentUser?.id)){
               await user?.updateOne({$push:{followers:req.body.userId}});
               await currentUser?.updateOne({$push:{followings:req.params.id}});
               res.status(200).json({'msg':'Kullanıcıyı takip etme başarılı'})
            }
            else{
               res.status(403).json({'msg':'Bu kullanıcıyı zaten takip ediyorsun'})
            }

         } catch (error) {
            res.status(500).json(error)
         }
       }
      
   }


   public static async unfollow(req:authRequest,res:Response){
      if (req.body.userId!=req.params.id){
         try {
            const user=await User.findById(req.params.id);
            const currentuser=await User.findById(req.body.userId);
            if (user?.followers.includes(currentuser?.id)){
               await user?.updateOne({$pull:{followers:req.body.userId}})
               await currentuser?.updateOne({$pull:{followings:req.params.id}});
               res.status(200).json({'msg':'Kullanıcıyı takipten çıktınız'})
            }
   
            else{
               res.status(403).json({'msg':'Bu kullanıcıyı takip etmiyorsunuz'})
            }
         } catch (error) {
            res.status(500).json(error)
         }

         
      }  

   
      
   }


 
}

export default UserController;