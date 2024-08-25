import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
    id: number; 
}

export const authenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({success: false, error: "No token exists", message: "No token exists"});
        }
        
        const { id } = jwt.verify(token, process.env.JWTPRIVATEKEY as string) as JwtPayload;
        
        // Check if the user exists in the database
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(401).send({success: false, error: "User not found", message: "Authentication failed"});
        }

        // Attach the user ID to the request
        req.headers.id = id.toString();
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send({success: false, error: err, message: "Authentication failed"});
    }
};