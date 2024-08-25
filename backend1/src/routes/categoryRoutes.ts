import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { categoryValidate } from '../middlewares/validators';
import { prisma } from '../config/dbconfig';


const router = require('express').Router();


router.get('/', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });

        return res.status(200).send({
            success: true,
            data: categories
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting categories", error });
    }
});

router.post('/', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { error } = categoryValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const existingCategory = await prisma.category.findFirst({
            where: { name: req.body.name, userId: Number(req.headers.id) }
        });

        if (existingCategory)
            return res.status(409).send({ errors: { name: 'Category with given name already exists' }, success: false });

        const newCategory = await prisma.category.create({
            data: { 
                name: req.body.name,
                userId: Number(req.headers.id)
            },
            select: { id: true, name: true }
        });

        return res.status(201).send({ 
            data: newCategory, 
            message: "Category created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.put('/:categoryId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { error } = categoryValidate(req.body);
        
        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const categoryId = Number(req.params.categoryId.split(':')[1]);
        
        const existingCategory = await prisma.category.findFirst({
            where: { userId: Number(req.headers.id), id: categoryId }
        });

        if (!existingCategory)
            return res.status(409).send({ errors: { name: "Category with given id doesn't exist" }, success: false });

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
                userId: Number(req.headers.id)
            },
            data: { name: req.body.name }
        });
        
        if (!updatedCategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });

        const category = await prisma.category.findUnique({ where: { id: categoryId } });

        return res.status(200).send({
            success: true,
            data: category,
            message: "Category updated"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:categoryId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId.split(':')[1]);
        
        const deletedCategory = await prisma.category.delete({
            where: {
                id: categoryId,
                userId: Number(req.headers.id)
            }
        });
        
        if (!deletedCategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            message: "Category deleted",
            data:{
                id:categoryId
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const categoryIds: number[] = req.body.Ids.map(Number);

        await prisma.category.deleteMany({ 
            where: { 
                id: { in: categoryIds },
                userId: Number(req.headers.id) 
            }
        });
        
        const categories = await prisma.category.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });

        return res.status(200).send({
            success: true,
            data: categories
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting categories", error });
    }
});

export { router };