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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validators_1 = require("../middlewares/validators");
const dbconfig_1 = require("../config/dbconfig");
const router = require('express').Router();
exports.router = router;
const generateAuthToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWTPRIVATEKEY);
};
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.registerValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const existingUser = yield dbconfig_1.prisma.user.findFirst({
            where: { OR: [{ name: req.body.name }, { email: req.body.email }] }
        });
        if (existingUser) {
            if (existingUser.name === req.body.name) {
                return res.status(409).send({ errors: { name: 'User with given name already exists' }, success: false });
            }
            if (existingUser.email === req.body.email) {
                return res.status(409).send({ errors: { email: 'User with given email already exists' }, success: false });
            }
        }
        const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const newUser = yield dbconfig_1.prisma.user.create({
            data: Object.assign(Object.assign({}, req.body), { password: hashPassword })
        });
        const token = generateAuthToken(newUser.id);
        return res.status(201).send({ authToken: token, message: "Signed in successfully", success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.loginValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const user = yield dbconfig_1.prisma.user.findUnique({ where: { email: req.body.email } });
        if (!user)
            return res.status(401).send({ errors: { email: 'User with given email does not exist' }, success: false });
        const validatePassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });
        const token = generateAuthToken(user.id);
        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.get('/me', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbconfig_1.prisma.user.findUnique({ where: { id: Number(req.headers.id) } });
        if (!user)
            return res.status(400).send({ message: "User does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting user", error });
    }
}));
