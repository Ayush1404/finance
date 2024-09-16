"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFilterValidate = exports.transactionValidate = exports.accountValidate = exports.categoryValidate = exports.registerValidate = exports.loginValidate = void 0;
const zod_1 = require("zod");
// Define the password complexity schema
const passwordComplexity = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
// Login validation
const loginValidate = (data) => {
    const schema = zod_1.z.object({
        email: zod_1.z
            .string()
            .email({ message: 'Please enter a valid email address' })
            .min(1, { message: 'Email is required' }),
        password: passwordComplexity
            .min(1, { message: 'Password is required' }),
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.loginValidate = loginValidate;
// Register validation
const registerValidate = (data) => {
    const schema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: 'Name is required' })
            .max(15, { message: 'Name can not have more than 15 characters' }),
        email: zod_1.z
            .string()
            .email({ message: 'Please enter a valid email address' })
            .min(1, { message: 'Email is required' }),
        password: passwordComplexity
            .min(1, { message: 'Password is required' })
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.registerValidate = registerValidate;
// Category validation
const categoryValidate = (data) => {
    const schema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: 'Name is required' })
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.categoryValidate = categoryValidate;
// Account validation
const accountValidate = (data) => {
    const schema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: 'Name is required' })
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.accountValidate = accountValidate;
// Transaction validation
const transactionValidate = (data) => {
    const schema = zod_1.z.object({
        payee: zod_1.z.string().min(1, { message: 'Payee is required' }),
        amount: zod_1.z.string(),
        notes: zod_1.z.string().optional().nullable().default(''),
        date: zod_1.z.string().or(zod_1.z.date()).optional().default(() => new Date().toISOString()),
        accountId: zod_1.z.number().int().positive({ message: 'Account ID must be a positive integer' }),
        categoryId: zod_1.z.number().int().positive({ message: 'Category ID must be a positive integer' }).optional().nullable(),
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.transactionValidate = transactionValidate;
// Transaction Filter validation
const transactionFilterValidate = (data) => {
    const schema = zod_1.z.object({
        from: zod_1.z.string().optional(),
        to: zod_1.z.string().optional(),
        accountId: zod_1.z.string().optional()
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.transactionFilterValidate = transactionFilterValidate;
