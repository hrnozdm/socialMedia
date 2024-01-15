import express,{Express,Router,Request,Response} from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";


const router=Router();
router.get('/',(req:Request,res:Response)=>{res.send('Anasayfa')});
router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.put('/user/:id',UserController.updateUser)
router.delete('/user/:id',UserController.deleteUser)
router.get('/user/:id',UserController.getUser)
export default router;

