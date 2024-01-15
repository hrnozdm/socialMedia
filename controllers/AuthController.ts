import User from "../models/User";
import { Request,Response } from "express";
import jwt,{Secret} from "jsonwebtoken";
import bcrypt from "bcrypt";
class AuthController{
   
    private static emailRegex(email:any):Boolean{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return  emailRegex.test(email);
    }
    public static async register(req:Request,res:Response){
        const {email,password}=req.body;
        const secret:Secret="SECRET_KEY";
        const hashedPassword=await bcrypt.hash(password,12);
         const newUser=new User({...req.body,password:hashedPassword});
         try {
            const user=await User.findOne({$or:[
                {email:req.body.email},
                {username:req.body.username},
            ]});

            if (user){
                return res.status(401).json({'msg':'Bu kullanıcı zaten mevcut'});
            }

            if (!AuthController.emailRegex(email)){
                return res.status(400).json({'msg':'Geçerli bir email giriniz'});
            }

            if (password.length<6){
                return res.status(400).json({'msg':'Şifre 6 karakterden az olamaz'});
            }
             
            await newUser.save();
            const token=jwt.sign({id:newUser.id,isAdmin:newUser.isAdmin},secret,{expiresIn:"1h"});
            res.cookie("token",token,{httpOnly:true}).status(201).json({token,newUser});
         } catch (error) {
              res.status(500).json(error);
         }
     }

     public static async login(req:Request,res:Response){
        const {email,password}=req.body;
        const secret:Secret="SECRET_KEY";
         try {
              const user:any=await User.findOne({email:email});
              if (!user){
                return res.status(401).json({'msg':'Kullanıcı kaydı yok'})
              }

              else{
                const passCompare=await bcrypt.compare(password,user.password)
                if (!passCompare){
                   return res.status(400).json({'msg':'Yanlış şifre'});
                }
                
                const token=jwt.sign({id:user.id,isAdmin:user.isAdmin},secret,{expiresIn:"1h"});
                 res.cookie("token",token,{httpOnly:true}).status(201).json({token,user});
                return res.status(200).json({'msg':'Kullanıcı girişi başarılı'})
            }
  
         } catch (error) {
            return res.status(400).json()
         }
     }

}

export default AuthController;

