import mongoose from 'mongoose';
import { z } from 'zod';
import { handleCascadeDeleteTransactionsByCategory } from '../middlewares/mongooseMiddlewares';

const categorySchema =new mongoose.Schema({
    name:
    {
      type:String,
      required:true
    },
    userId:
    {
        type:String,
        required:true
    }
    
  },{
    timestamps:true
    }
);

categorySchema.pre('findOneAndDelete', async function(next) {
  try {
    const category = await this.model.findById(this.getQuery()._id);
    if (category) {
      await handleCascadeDeleteTransactionsByCategory(category._id);
    }
    next();
  } catch (err:any) {
    next(err);
  }
});
categorySchema.pre('deleteMany', async function(next) {
  try {
    const category = await this.model.findById(this.getQuery()._id);
    if (category) {
      await handleCascadeDeleteTransactionsByCategory(category._id);
    }
    next();
  } catch (err:any) {
    next(err);
  }
});
  
export const categoryModel = mongoose.model("categories",categorySchema);

export const categoryValidate = (data: any) => {
    const schema = z.object({
      name: z
        .string()
        .min(1,{ message: 'Name is required' })
    });
    try {
      schema.parse(data);
      return { error: null };
    } catch (e:any) {
      return { error: e.errors };
    }
};