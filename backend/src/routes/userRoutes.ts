import { Request, Response } from 'express';
import { generateAuthToken, loginValidate, registerValidate, userModel } from '../models/userModel';
import bcrypt from 'bcrypt';
import { authenticatejwt } from '../middlewares/authMiddleware';

const router = require('express').Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { error } = registerValidate(req.body);

        if (error) {
            const errors:Record<string,string>= {}
            error.forEach((err:{
                path:string[],
                message:string
            })=>{
                errors[err.path[0]]=err.message
            })
            return res.status(400).send({ errors, success: false });
        }

        let user = await userModel.findOne({ name: req.body.name });
        if (user)
            return res.status(409).send({ errors: { name: 'User with given name already exists' }, success: false });

        user = await userModel.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ errors: { email: 'User with given email already exists' }, success: false });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new userModel({ ...req.body, password: hashPassword }).save();
        const usernew = await userModel.findOne({ name: req.body.name });
        if (!usernew)
            return res.status(500).send({ message: "Error creating user", success: false });

        const token = generateAuthToken(usernew._id);

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
            const errors:Record<string,string>= {}
            error.forEach((err:{
                path:string[],
                message:string
            })=>{
                errors[err.path[0]]=err.message
            })
            return res.status(400).send({ errors, success: false });
        }

        const user = await userModel.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ errors: {email: 'User with given email does not exist' }, success: false });

        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });

        const token = generateAuthToken(user._id);

        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.get('/me', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ _id: req.headers.id });
        if (!user) return res.status(400).send({ message: "User does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: user._id,
                    email: user.email,
                    name:user.name
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting user", error });
    }
});

export {router};
