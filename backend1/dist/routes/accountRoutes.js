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
        const accounts = yield dbconfig_1.prisma.account.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });
        return res.status(200).send({
            success: true,
            data: accounts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
}));
router.post('/', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.accountValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const existingAccount = yield dbconfig_1.prisma.account.findFirst({
            where: { name: req.body.name, userId: Number(req.headers.id) }
        });
        if (existingAccount)
            return res.status(409).send({ errors: { name: 'Account with given name already exists' }, success: false });
        const newAccount = yield dbconfig_1.prisma.account.create({
            data: {
                name: req.body.name,
                userId: Number(req.headers.id)
            },
            select: { id: true, name: true }
        });
        return res.status(201).send({
            data: newAccount,
            message: "Account created successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.put('/:accountId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.accountValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const accountId = Number(req.params.accountId.split(':')[1]);
        const existingAccount = yield dbconfig_1.prisma.account.findFirst({
            where: { userId: Number(req.headers.id), id: accountId }
        });
        if (!existingAccount)
            return res.status(409).send({ errors: { name: "Account with given id doesn't exist" }, success: false });
        const updatedAccount = yield dbconfig_1.prisma.account.update({
            where: {
                id: accountId,
                userId: Number(req.headers.id)
            },
            data: { name: req.body.name }
        });
        if (!updatedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });
        const account = yield dbconfig_1.prisma.account.findUnique({ where: { id: accountId } });
        return res.status(200).send({
            success: true,
            data: account,
            message: "Account updated"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.delete('/:accountId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = Number(req.params.accountId.split(':')[1]);
        const deletedAccount = yield dbconfig_1.prisma.account.delete({
            where: {
                id: accountId,
                userId: Number(req.headers.id)
            }
        });
        if (!deletedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });
        return res.status(200).send({
            success: true,
            message: "Account deleted",
            data: {
                id: accountId
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
        const accountIds = req.body.Ids.map(Number);
        yield dbconfig_1.prisma.account.deleteMany({
            where: {
                id: { in: accountIds },
                userId: Number(req.headers.id)
            }
        });
        const accounts = yield dbconfig_1.prisma.account.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });
        return res.status(200).send({
            success: true,
            data: accounts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting accounts", error });
    }
}));
