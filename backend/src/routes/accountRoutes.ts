import { Request, Response } from 'express';
import { authenticatejwt } from '../middlewares/authMiddleware';
import { accountModel, accountValidate } from '../models/accountModel';

const router = require('express').Router();

router.get('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const accounts = await accountModel.find({ userId: req.headers.id }) ;
        const accountsData = accounts.map((account)=>({
            id:account._id,
            name:account.name
        }))

        return res.status(200).send({
            success: true,
            data: accountsData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
});

router.post('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { error } = accountValidate(req.body);

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

        const account = await accountModel.findOne({ name: req.body.name , userId:req.headers.id});
        if (account)
            return res.status(409).send({ errors: { name: 'Account with given name already exists' }, success: false });

        await new accountModel({ 
            ...req.body , 
            userId : req.headers.id 
        }).save();

        const accountnew = await accountModel.findOne({ name: req.body.name });
        
        if (!accountnew)
            return res.status(500).send({ message: "Error creating account", success: false });

        return res.status(201).send({ 
            data:{
                id:accountnew._id,
                name:accountnew.name
            } , 
            message: "Account created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.put('/:accountId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { error } = accountValidate(req.body);
        
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
        const accountId = req.params.accountId.split(':')[1]
        
        const account = await accountModel.findOne({ name: req.body.name , userId:req.headers.id});
        if (account)
            return res.status(409).send({ errors: { name: 'Account with given name already exists' }, success: false });

        const updatedAccount = await accountModel.findOneAndUpdate({
            _id:accountId,
            userId:req.headers.id
        },{
            name:req.body.name
        },{
            new:true
        })
        
        if (!updatedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            data: updatedAccount,
            message:"Account updated"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:accountId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        
        const accountId = req.params.accountId.split(':')[1]
        
        const deletedAccount = await accountModel.findOneAndDelete({
            _id:accountId,
            userId:req.headers.id
        })
        
        if (!deletedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            data: deletedAccount,
            message:"Account deleted"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticatejwt, async (req: Request, res: Response) => {
    try {

        const accountIds:string[] = req.body.Ids; 

        await accountModel.deleteMany({ 
            _id:{$in:accountIds},
            userId: req.headers.id 
        }) ;
        
        const accounts = await accountModel.find({ userId: req.headers.id }) ;
        const accountsData = accounts.map((account)=>({
            id:account._id,
            name:account.name
        }))

        return res.status(200).send({
            success: true,
            data:accountsData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting accounts", error });
    }
});
export {router};
