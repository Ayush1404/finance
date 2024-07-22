import { Request, Response } from 'express';
import { authenticatejwt } from '../middlewares/authMiddleware';
import { categoryModel, categoryValidate } from '../models/categoryModel';

const router = require('express').Router();

router.get('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const categories = await categoryModel.find({ userId: req.headers.id }) ;
        const categoriesData = categories.map((category)=>({
            id:category._id,
            name:category.name
        }))

        return res.status(200).send({
            success: true,
            data: categoriesData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting categories", error });
    }
});

router.post('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { error } = categoryValidate(req.body);

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

        const category = await categoryModel.findOne({ name: req.body.name , userId:req.headers.id});
        if (category)
            return res.status(409).send({ errors: { name: 'Category with given name already exists' }, success: false });

        await new categoryModel({ 
            ...req.body , 
            userId : req.headers.id 
        }).save();

        const categorynew = await categoryModel.findOne({ name: req.body.name });
        
        if (!categorynew)
            return res.status(500).send({ message: "Error creating category", success: false });

        return res.status(201).send({ 
            data:{
                id:categorynew._id,
                name:categorynew.name
            } , 
            message: "Category created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.put('/:categoryId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { error } = categoryValidate(req.body);
        
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
        const categoryId = req.params.categoryId.split(':')[1]
        
        const category = await categoryModel.findOne({ name: req.body.name , userId:req.headers.id});
        if (category)
            return res.status(409).send({ errors: { name: 'Category with given name already exists' }, success: false });

        const updatedcategory = await categoryModel.findOneAndUpdate({
            _id:categoryId,
            userId:req.headers.id
        },{
            name:req.body.name
        },{
            new:true
        })
        
        if (!updatedcategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            data: updatedcategory,
            message:"Category updated"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:categoryId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        
        const categoryId = req.params.categoryId.split(':')[1]
        
        const deletedcategory = await categoryModel.findOneAndDelete({
            _id:categoryId,
            userId:req.headers.id
        })
        
        if (!deletedcategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            data: deletedcategory,
            message:"Category deleted"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticatejwt, async (req: Request, res: Response) => {
    try {

        const categoryIds:string[] = req.body.Ids; 

        await categoryModel.deleteMany({ 
            _id:{$in:categoryIds},
            userId: req.headers.id 
        }) ;
        
        const categories = await categoryModel.find({ userId: req.headers.id }) ;
        const categoriesData = categories.map((category)=>({
            id:category._id,
            name:category.name
        }))

        return res.status(200).send({
            success: true,
            data:categoriesData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting categories", error });
    }
});
export {router};
