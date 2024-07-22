import mongoose from "mongoose";
import { transactionModel } from "../models/transactionModel";

export async function handleCascadeDeleteTransactionsByAccount(accountId: mongoose.Types.ObjectId): Promise<void> {
    await transactionModel.deleteMany({ accountId : accountId });
}

export async function handleCascadeDeleteTransactionsByCategory(categoryId: mongoose.Types.ObjectId): Promise<void> {
    await transactionModel.updateMany({ categoryId : categoryId },{
        categoryId:null
    });
}