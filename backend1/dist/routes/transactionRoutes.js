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
        const transactions = yield dbconfig_1.prisma.transaction.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
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
        const existingTransaction = yield dbconfig_1.prisma.transaction.findFirst({
            where: { name: req.body.name, userId: Number(req.headers.id) }
        });
        if (existingTransaction)
            return res.status(409).send({ errors: { name: 'Transaction with given name already exists' }, success: false });
        const newTransaction = yield dbconfig_1.prisma.transaction.create({
            data: {
                name: req.body.name,
                userId: Number(req.headers.id)
            },
            select: { id: true, name: true }
        });
        return res.status(201).send({
            data: newTransaction,
            message: "Transaction created successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
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
            where: { name: req.body.name, userId: Number(req.headers.id), NOT: { id: transactionId } }
        });
        if (existingTransaction)
            return res.status(409).send({ errors: { name: 'Transaction with given name already exists' }, success: false });
        const updatedTransaction = yield dbconfig_1.prisma.transaction.updateMany({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            },
            data: { name: req.body.name }
        });
        if (updatedTransaction.count === 0)
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
        const deletedTransaction = yield dbconfig_1.prisma.transaction.deleteMany({
            where: {
                id: transactionId,
                userId: Number(req.headers.id)
            }
        });
        if (deletedTransaction.count === 0)
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
            select: { id: true, name: true }
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
