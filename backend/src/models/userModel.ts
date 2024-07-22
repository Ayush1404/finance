import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const userSchema =new mongoose.Schema({
  name:
  {
    type:String,
    required:true
  },
  email:
  {
    type:String ,
    required: true
  },
  password:{
    type:String ,
    required: true
  },
},{
  timestamps:true
});

export const userModel = mongoose.model("users",userSchema);

export const generateAuthToken = function(id:any){
    const token = jwt.sign({id}, process.env.JWTPRIVATEKEY!);
    return token;
}


// Define the password complexity schema
const passwordComplexity = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Login validation
export const loginValidate = (data: any) => {
  const schema = z.object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1,{ message: 'Email is required' }),
    password: passwordComplexity
      .min(1,{ message: 'Password is required' }),
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e:any) {
    return { error: e.errors };
  }
};

// Register validation
export const registerValidate = (data: any) => {
  const schema = z.object({
    name: z
      .string()
      .min(1,{ message: 'Name is required' })
      .max(15,{message:'Name can not have more than 15 characters'}),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1,{ message: 'Email is required' }),
    password: passwordComplexity
      .min(1,{ message: 'Password is required' })
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e:any) {
    return { error: e.errors };
  }
};
