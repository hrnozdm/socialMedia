import express,{Express,Router,Request,Response} from "express";


const router=Router();
router.get('/',(req,res)=>{res.send('Anasayfa')});

export default router;

