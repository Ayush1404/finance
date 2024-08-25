import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { accountValidate } from '../middlewares/validators';
import { prisma } from '../config/dbconfig';

const router = require('express').Router();

router.get('/', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const accounts = await prisma.account.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });

        return res.status(200).send({
            success: true,
            data: accounts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
});

router.post('/', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { error } = accountValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const existingAccount = await prisma.account.findFirst({
            where: { name: req.body.name, userId: Number(req.headers.id) }
        });

        if (existingAccount)
            return res.status(409).send({ errors: { name: 'Account with given name already exists' }, success: false });

        const newAccount = await prisma.account.create({
            data: { 
                name: req.body.name,
                userId: Number(req.headers.id)
            },
            select: { id: true, name: true }
        });

        return res.status(201).send({ 
            data: newAccount, 
            message: "Account created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.put('/:accountId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { error } = accountValidate(req.body);
        
        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const accountId = Number(req.params.accountId.split(':')[1]);
        
        const existingAccount = await prisma.account.findFirst({
            where: { userId: Number(req.headers.id), id: accountId }
        });

        if (!existingAccount)
            return res.status(409).send({ errors: { name:"Account with given id doesn't exist"}, success: false });

        const updatedAccount = await prisma.account.update({
            where: {
                id: accountId,
                userId: Number(req.headers.id)
            },
            data: { name: req.body.name }
        });
        
        if (!updatedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });

        const account = await prisma.account.findUnique({ where: { id: accountId } });

        return res.status(200).send({
            success: true,
            data: account,
            message: "Account updated"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:accountId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const accountId = Number(req.params.accountId.split(':')[1]);
        
        const deletedAccount = await prisma.account.delete({
            where: {
                id: accountId,
                userId: Number(req.headers.id)
            }
        });
        
        if (!deletedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            message: "Account deleted",
            data:{
                id:accountId
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const accountIds: number[] = req.body.Ids.map(Number);

        await prisma.account.deleteMany({ 
            where: { 
                id: { in: accountIds },
                userId: Number(req.headers.id) 
            }
        });
        
        const accounts = await prisma.account.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });

        return res.status(200).send({
            success: true,
            data: accounts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting accounts", error });
    }
})

export {router}