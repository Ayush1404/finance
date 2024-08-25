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
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).send({ success: false, error: "No token exists", message: "No token exists" });
        }
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWTPRIVATEKEY);
        // Check if the user exists in the database
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(401).send({ success: false, error: "User not found", message: "Authentication failed" });
        }
        // Attach the user ID to the request
        req.headers.id = id.toString();
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send({ success: false, error: err, message: "Authentication failed" });
    }
});
exports.authenticateJwt = authenticateJwt;
