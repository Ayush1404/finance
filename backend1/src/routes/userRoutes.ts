import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { loginValidate, registerValidate } from '../middlewares/validators';
import { prisma } from '../config/dbconfig';

const router = require('express').Router();

const generateAuthToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWTPRIVATEKEY!);
};

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { error } = registerValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ name: req.body.name }, { email: req.body.email }] }
        });

        if (existingUser) {
            if (existingUser.name === req.body.name) {
                return res.status(409).send({ errors: { name: 'User with given name already exists' }, success: false });
            }
            if (existingUser.email === req.body.email) {
                return res.status(409).send({ errors: { email: 'User with given email already exists' }, success: false });
            }
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await prisma.user.create({
            data: { ...req.body, password: hashPassword }
        });

        const token = generateAuthToken(newUser.id);

        return res.status(201).send({ authToken: token, message: "Signed in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { error } = loginValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const user = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (!user)
            return res.status(401).send({ errors: { email: 'User with given email does not exist' }, success: false });

        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });

        const token = generateAuthToken(user.id);

        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.get('/me', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(req.headers.id) } });
        if (!user) return res.status(400).send({ message: "User does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting user", error });
    }
});

export { router };