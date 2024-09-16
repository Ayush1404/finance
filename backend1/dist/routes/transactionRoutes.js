"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validators_1 = require("../middlewares/validators");
const dbconfig_1 = require("../config/dbconfig");
const date_fns_1 = require("date-fns");
const router = require('express').Router();
exports.router = router;
router.get('/', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.transactionFilterValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const { from, to, accountId } = req.body;
        const defaultTo = new Date();
        const defaultFrom = (0, date_fns_1.subDays)(defaultTo, 30);
        const startDate = from ? (0, date_fns_1.parse)(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
        const endDate = to ? (0, date_fns_1.parse)(to, 'yyyy-MM-dd', new Date()) : defaultTo;
        const transactions = yield dbconfig_1.prisma.transaction.findMany({
            where: {
                userId: Number(req.headers.id),
                accountId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                categoryId: true,
                date: true,
                payee: true,
                amount: true,
                notes: true,
                accountId: true,
                account: {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        return res.status(200).send({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting transactions", error });
    }
}));
router.post('/', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.transactionValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const newTransaction = yield dbconfig_1.prisma.transaction.create({
            data: {
                payee: req.body.payee,
                amount: req.body.amount,
                notes: req.body.notes || null,
                date: new Date(req.body.date),
                accountId: req.body.accountId,
                categoryId: req.body.categoryId || null,
                userId: Number(req.headers.id)
            },
            select: {
                id: true,
                payee: true,
                amount: true,
                date: true,
                accountId: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                },
                account: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return res.status(201).send({
            data: newTransaction,
            message: "Transaction created successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Internal server error",
            success: false
        });
    }
}));
router.put('/:transactionId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.transactionValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const transactionId = Number(req.params.transactionId.split(':')[1]);
        const existingTransaction = yield dbconfig_1.prisma.transaction.findFirst({
            where: { userId: Number(req.headers.id), id: transactionId }
        });
        if (!existingTransaction)
            return res.status(409).send({ errors: { id: "Transaction with given id doesn't exist" }, success: false });
        const updatedTransaction = yield dbconfig_1.prisma.transaction.update({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            },
            data: Object.assign({}, req.body)
        });
        if (!updatedTransaction)
            return res.status(500).send({ message: "No transaction found for this user with given id", success: false });
        const transaction = yield dbconfig_1.prisma.transaction.findUnique({ where: { id: transactionId } });
        return res.status(200).send({
            success: true,
            data: transaction,
            message: "Transaction updated"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.delete('/:transactionId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionId = Number(req.params.transactionId.split(':')[1]);
        const deletedTransaction = yield dbconfig_1.prisma.transaction.delete({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            }
        });
        if (!deletedTransaction)
            return res.status(500).send({ message: "No transaction found for this user with given id", success: false });
        return res.status(200).send({
            success: true,
            message: "Transaction deleted",
            data: {
                id: transactionId
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.post('/bulkdelete', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionIds = req.body.Ids.map(Number);
        yield dbconfig_1.prisma.transaction.deleteMany({
            where: {
                id: { in: transactionIds },
                userId: Number(req.headers.id)
            }
        });
        const transactions = yield dbconfig_1.prisma.transaction.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true }
        });
        return res.status(200).send({
            success: true,
            data: transactions
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting transactions", error });
    }
}));
