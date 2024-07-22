import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

const transactionSchema =new mongoose.Schema({
    name:
    {
      type:String,
      required:true
    },
    payee:
    {
        type:String,
        required:true
    },
    amount:
    {
        type:BigInt,
        default:0,
    },
    notes:
    {
        type:String,
    },
    date:{
        type:String,
        default:Date.now().toString()
    },
    accountId:{
        type:Schema.ObjectId,
        ref:'accounts'
        
    },
    categoryId:{
        type:Schema.ObjectId,
        ref:'categories'
    }
  },{
    timestamps:true
    }
);
  
export const transactionModel = mongoose.model("transactions",transactionSchema);

export const transactionValidate = (data: any) => {
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