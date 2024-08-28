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
        const categories = yield dbconfig_1.prisma.category.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });
        return res.status(200).send({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting categories", error });
    }
}));
router.post('/', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.categoryValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const existingCategory = yield dbconfig_1.prisma.category.findFirst({
            where: { name: req.body.name, userId: Number(req.headers.id) }
        });
        if (existingCategory)
            return res.status(409).send({ errors: { name: 'Category with given name already exists' }, success: false });
        const newCategory = yield dbconfig_1.prisma.category.create({
            data: {
                name: req.body.name,
                userId: Number(req.headers.id)
            },
            select: { id: true, name: true }
        });
        return res.status(201).send({
            data: newCategory,
            message: "Category created successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.put('/:categoryId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.categoryValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const categoryId = Number(req.params.categoryId.split(':')[1]);
        const existingCategory = yield dbconfig_1.prisma.category.findFirst({
            where: { userId: Number(req.headers.id), id: categoryId }
        });
        if (!existingCategory)
            return res.status(409).send({ errors: { name: "Category with given id doesn't exist" }, success: false });
        const updatedCategory = yield dbconfig_1.prisma.category.update({
            where: {
                id: categoryId,
                userId: Number(req.headers.id)
            },
            data: { name: req.body.name }
        });
        if (!updatedCategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });
        const category = yield dbconfig_1.prisma.category.findUnique({ where: { id: categoryId } });
        return res.status(200).send({
            success: true,
            data: category,
            message: "Category updated"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.delete('/:categoryId', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = Number(req.params.categoryId.split(':')[1]);
        const deletedCategory = yield dbconfig_1.prisma.category.delete({
            where: {
                id: categoryId,
                userId: Number(req.headers.id)
            }
        });
        if (!deletedCategory)
            return res.status(500).send({ message: "No category found for this user with given id", success: false });
        return res.status(200).send({
            success: true,
            message: "Category deleted",
            data: {
                id: categoryId
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
        const categoryIds = req.body.Ids.map(Number);
        yield dbconfig_1.prisma.category.deleteMany({
            where: {
                id: { in: categoryIds },
                userId: Number(req.headers.id)
            }
        });
        const categories = yield dbconfig_1.prisma.category.findMany({
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });
        return res.status(200).send({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting categories", error });
    }
}));
