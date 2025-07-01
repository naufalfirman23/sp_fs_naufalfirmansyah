"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'sellerpintar_secret';
function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        throw new Error('Unauthorized');
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') {
        throw new Error('Invalid token');
    }
    return decoded;
}
