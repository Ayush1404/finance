import mongoose from 'mongoose';
import { z } from 'zod';
import { handleCascadeDeleteTransactionsByAccount } from '../middlewares/mongooseMiddlewares';

const accountSchema =new mongoose.Schema({
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
accountSchema.pre('findOneAndDelete', async function(next) {
  try {
    const account = await this.model.findById(this.getQuery()._id);
    if (account) {
      await handleCascadeDeleteTransactionsByAccount(account._id);
    }
    next();
  } catch (err:any) {
    next(err);
  }
});
accountSchema.pre('deleteMany', async function(next) {
  try {
    const account = await this.model.findById(this.getQuery()._id);
    if (account) {
      await handleCascadeDeleteTransactionsByAccount(account._id);
    }
    next();
  } catch (err:any) {
    next(err);
  }
});

export const accountModel = mongoose.model("accounts",accountSchema);

export const accountValidate = (data: any) => {
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