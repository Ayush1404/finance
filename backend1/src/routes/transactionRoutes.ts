import { Request, Response } from 'express';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { transactionFilterValidate, transactionValidate } from '../middlewares/validators';
import { prisma } from '../config/dbconfig';
import { parse, subDays } from 'date-fns';

const router = require('express').Router();

router.get('/', authenticateJwt, async (req: Request, res: Response) => {
    try {

        const { error } = transactionFilterValidate(req.body)

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const { from , to , accountId } = req.body;
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo,30);

        const startDate =  from ? parse(from , 'yyyy-MM-dd' , new Date()) : defaultFrom
        const endDate =  to ? parse(to , 'yyyy-MM-dd' , new Date()) : defaultTo

        const transactions = await prisma.transaction.findMany({
            where: { 
                userId: Number(req.headers.id), 
                accountId,
                date:{
                    gte:startDate,
                    lte:endDate
                }
            },
            select: {
                id: true,
                categoryId: true,
                date:true,
                payee: true,
                amount: true,
                notes: true,
                accountId: true,
                account: {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy:{
                date:'desc'
            }
        });

        return res.status(200).send({
            success: true,
            data: transactions
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting transactions", error });
    }
});

router.post('/', authenticateJwt, async (req: Request, res: Response) => {
    try {
        
        const { error } = transactionValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const newTransaction = await prisma.transaction.create({
            data: { 
                payee: req.body.payee,
                amount: req.body.amount, 
                notes: req.body.notes || null,
                date: new Date(req.body.date), 
                accountId: req.body.accountId,
                categoryId: req.body.categoryId || null, 
                userId: Number(req.headers.id)
            },
            select: { 
                id: true, 
                payee: true, 
                amount: true, 
                date: true, 
                accountId: true, 
                categoryId: true,
                category:{
                    select:{
                        name:true
                    }
                },
                account:{
                    select:{
                        name:true
                    }
                }
            }
        });

        return res.status(201).send({ 
            data: newTransaction, 
            message: "Transaction created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ 
            message: "Internal server error", 
            success: false 
        });
    }
});

router.put('/:transactionId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { error } = transactionValidate(req.body);
        
        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const transactionId = Number(req.params.transactionId.split(':')[1]);
        
        const existingTransaction = await prisma.transaction.findFirst({
            where: { userId: Number(req.headers.id), id: transactionId }
        });

        if (!existingTransaction)
            return res.status(409).send({ errors: { id: "Transaction with given id doesn't exist" }, success: false });

        
        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            },
            data: { 
                ...req.body  
            }
        });
        
        if (!updatedTransaction)
            return res.status(500).send({ message: "No transaction found for this user with given id", success: false });

        const transaction = await prisma.transaction.findUnique({ 
            where: { id: transactionId }, 
            select:{
                id: true, 
                payee: true, 
                amount: true, 
                date: true, 
                accountId: true, 
                categoryId: true,
                category:{
                    select:{
                        name:true
                    }
                },
                account:{
                    select:{
                        name:true
                    }
                }
            }
        });

        return res.status(200).send({
            success: true,
            data: transaction,
            message: "Transaction updated"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:transactionId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const transactionId = Number(req.params.transactionId.split(':')[1]);
        
        const deletedTransaction = await prisma.transaction.delete({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            }
        });
        
        if (!deletedTransaction)
            return res.status(500).send({ message: "No transaction found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            message: "Transaction deleted",
            data:{
                id:transactionId
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const transactionIds: number[] = req.body.Ids.map(Number);

        await prisma.transaction.deleteMany({ 
            where: { 
                id: { in: transactionIds },
                userId: Number(req.headers.id) 
            }
        });
        
        const transactions = await prisma.transaction.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true}
        });
        const newTransactionIds = transactions.map((transaction)=>transaction.id)
        return res.status(200).send({
            success: true,
            data: newTransactionIds
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting transactions", error });
    }
})

export {router}