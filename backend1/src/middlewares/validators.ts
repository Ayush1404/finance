import { z } from 'zod';

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
      .min(1, { message: 'Email is required' }),
    password: passwordComplexity
      .min(1, { message: 'Password is required' }),
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Register validation
export const registerValidate = (data: any) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(15, { message: 'Name can not have more than 15 characters' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }),
    password: passwordComplexity
      .min(1, { message: 'Password is required' })
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Category validation
export const categoryValidate = (data: any) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Account validation
export const accountValidate = (data: any) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Transaction validation
export const transactionValidate = (data: any) => {
  const schema = z.object({
    payee: z.string().min(1, { message: 'Payee is required' }),
    amount: z.string(),
    notes: z.string().optional().nullable().default(''),
    date: z.string().or(z.date()).optional().default(() => new Date().toISOString()),
    accountId: z.number().int().positive({ message: 'Account ID must be a positive integer' }),
    categoryId: z.number().int().positive({ message: 'Category ID must be a positive integer' }).optional().nullable(),
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Transaction Filter validation
export const transactionFilterValidate = (data: any) => {
  const schema = z.object({
    from: z.string().optional().nullable(),
    to: z.string().optional().nullable(),
    accountId: z.string().optional().nullable()
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};

// Summary Filter validation
export const summaryFilterValidate = (data: any) => {
  const schema = z.object({
    from: z.string().optional().nullable(),
    to: z.string().optional().nullable(),
    accountId: z.string().optional().nullable()
  });

  try {
    schema.parse(data);
    return { error: null };
  } catch (e: any) {
    return { error: e.errors };
  }
};