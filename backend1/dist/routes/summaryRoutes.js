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
const date_fns_1 = require("date-fns");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validators_1 = require("../middlewares/validators");
const dbconfig_1 = require("../config/dbconfig");
const utils_1 = require("../lib/utils");
const router = require('express').Router();
exports.router = router;
router.post('/', authMiddleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, validators_1.summaryFilterValidate)(req.body);
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
        const periodLength = (0, date_fns_1.differenceInDays)(endDate, startDate) + 1;
        const lastPeriodStart = (0, date_fns_1.subDays)(startDate, periodLength);
        const lastPeriodEnd = (0, date_fns_1.subDays)(endDate, periodLength);
        function fetchFinancialData(userId, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield dbconfig_1.prisma.$queryRaw `
            SELECT
                COALESCE(SUM(CASE WHEN amount::numeric > 0 THEN amount::numeric ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN amount::numeric < 0 THEN amount::numeric ELSE 0 END), 0) AS expenses,
                COALESCE(SUM(amount::numeric), 0) AS remaining
            FROM "Transaction"
                WHERE "userId" = ${parseInt(userId)}
                AND "accountId" = ${parseInt(accountId)}
                AND "date" >= ${startDate}
                AND "date" <= ${endDate}
            `;
                return result;
            });
        }
        //@ts-ignore
        const [currentPeriod] = yield fetchFinancialData(
        //@ts-ignore
        req.headers.id, startDate, endDate);
        //@ts-ignore
        const [lastPeriod] = yield fetchFinancialData(
        //@ts-ignore
        req.headers.id, lastPeriodStart, lastPeriodEnd);
        const incomeChange = (0, utils_1.calculatePercentageChange)(currentPeriod.income, Number(lastPeriod.income));
        const expensesChange = (0, utils_1.calculatePercentageChange)(currentPeriod.expenses, Number(lastPeriod.expenses));
        const remainingChange = (0, utils_1.calculatePercentageChange)(currentPeriod.remaining, Number(lastPeriod.remaining));
        const categories = yield dbconfig_1.prisma.$queryRaw `
            SELECT 
            c.name,
            SUM(ABS(amount::numeric)) AS value
            FROM "Transaction" t
            INNER JOIN "Category" c ON t."categoryId" = c.id
            WHERE t."userId" = ${
        //@ts-ignore
        parseInt(req.headers.id)}
            AND t."accountId" = ${parseInt(accountId)}
            AND t."date" >= ${startDate}
            AND t."date" <= ${endDate}
            AND t.amount::numeric  < 0

            GROUP BY c.name
            ORDER BY value DESC;
        `;
        const topCategories = categories.slice(0, 3);
        const otherCategories = categories.slice(3);
        const otherSum = otherCategories.reduce((sum, curr) => sum + curr.value, 0);
        const finalCategories = topCategories;
        if (otherCategories.length > 0) {
            finalCategories.push({
                name: 'Other',
                value: otherSum
            });
        }
        const activeDays = yield dbconfig_1.prisma.$queryRaw `
            SELECT 
            t."date" as date,
            SUM(CASE WHEN t.amount::numeric > 0 THEN t.amount::numeric ELSE 0 END) AS income,
            SUM(CASE WHEN t.amount::numeric < 0 THEN ABS(t.amount::numeric) ELSE 0 END) AS expenses
            FROM "Transaction" t
            WHERE t."userId" = ${
        //@ts-ignore
        parseInt(req.headers.id)}
            AND t."accountId" = ${parseInt(accountId)}
            AND t."date" >= ${startDate}
            AND t."date" <= ${endDate}
            GROUP BY t."date"
            ORDER BY t."date" ASC;
        `;
        const finalDays = (0, utils_1.fillMissingDates)(activeDays, startDate, endDate);
        return res.status(200).send({
            success: true,
            data: {
                remainingAmount: currentPeriod.remaining,
                remainingChange,
                incomeAmount: currentPeriod.income,
                incomeChange,
                expensesAmount: currentPeriod.expenses,
                expensesChange: expensesChange * -1,
                categories: finalCategories,
                days: finalDays
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting summary", error });
    }
}));
