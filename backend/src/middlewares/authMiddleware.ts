import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from "express";
interface JwtPayload {
    id: string; 
}
export const authenticatejwt=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).send({success:false,error:new Error("No token exists"),message:"No token exists"})
        const {id}=jwt.verify(token,process.env.JWTPRIVATEKEY as string) as JwtPayload
        req.headers.id=id;
        next()
    }catch(err)
    {
        console.log(err)
        return res.status(401).send({success:false,error:err,message:"Authentication failed"})
    }
}