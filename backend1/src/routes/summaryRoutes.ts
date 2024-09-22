import { subDays , parse, differenceInDays } from "date-fns";
import { authenticateJwt } from "../middlewares/authMiddleware";
import { summaryFilterValidate } from "../middlewares/validators";
import { Request, Response } from 'express';
import { prisma } from "../config/dbconfig";
import { calculatePercentageChange, fillMissingDates } from "../lib/utils";

const router = require('express').Router();

router.post('/',authenticateJwt,async (req: Request, res: Response)=>{
    try{
        const { error } = summaryFilterValidate(req.body)

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const { from , to , accountId } = req.body;
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo,30);

        const startDate =  from ? parse(from , 'yyyy-MM-dd' , new Date()) : defaultFrom
        const endDate =  to ? parse(to , 'yyyy-MM-dd' , new Date()) : defaultTo

        const periodLength = differenceInDays(endDate,startDate)+1;
        const lastPeriodStart =  subDays(startDate,periodLength) 
        const lastPeriodEnd =  subDays(endDate,periodLength) 


        async function fetchFinancialData(
            userId: string,
            startDate: Date,
            endDate: Date,
        ){
            const result = await prisma.$queryRaw`
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
        }
        
        //@ts-ignore
        const [currentPeriod] = await fetchFinancialData(
            //@ts-ignore
            req.headers.id,
            startDate,
            endDate
        )
        
        //@ts-ignore
        const [lastPeriod] = await fetchFinancialData(
            //@ts-ignore
            req.headers.id,
            lastPeriodStart,
            lastPeriodEnd
        )
        
        const incomeChange = calculatePercentageChange(currentPeriod.income,Number(lastPeriod.income))
        const expensesChange = calculatePercentageChange(currentPeriod.expenses,Number(lastPeriod.expenses))
        const remainingChange = calculatePercentageChange(currentPeriod.remaining,Number(lastPeriod.remaining))

        const categories:{
            name:string,
            value:number
        }[] = await prisma.$queryRaw`
            SELECT 
            c.name AS category,
            SUM(ABS(amount::numeric)) AS value
            FROM "Transaction" t
            INNER JOIN "Category" c ON t."categoryId" = c.id
            WHERE t."userId" = ${
                //@ts-ignore
                parseInt(req.headers.id)
            }
            AND t."accountId" = ${parseInt(accountId)}
            AND t."date" >= ${startDate}
            AND t."date" <= ${endDate}
            AND t.amount::numeric  < 0

            GROUP BY c.name
            ORDER BY value DESC;
        `;

        const topCategories = categories.slice(0,3);
        const otherCategories = categories.slice(3);

        const otherSum = otherCategories.reduce((sum,curr)=>sum + curr.value,0)

        const finalCategories = topCategories

        if(otherCategories.length > 0)
        {
            finalCategories.push({
                name:'Other',
                value:otherSum
            })
        }

        const activeDays:{
            date:Date,
            income:number
            expenses:number
        }[] = await prisma.$queryRaw`
            SELECT 
            t."date" as date,
            SUM(CASE WHEN t.amount::numeric > 0 THEN t.amount::numeric ELSE 0 END) AS income,
            SUM(CASE WHEN t.amount::numeric < 0 THEN ABS(t.amount::numeric) ELSE 0 END) AS expenses
            FROM "Transaction" t
            WHERE t."userId" = ${
                //@ts-ignore
                parseInt(req.headers.id)
            }
            AND t."accountId" = ${parseInt(accountId)}
            AND t."date" >= ${startDate}
            AND t."date" <= ${endDate}
            GROUP BY t."date"
            ORDER BY t."date" ASC;
        `;

        const finalDays = fillMissingDates(activeDays,startDate,endDate)

        return res.status(200).send({
            success:true,
            data:{
                remainingAmount:currentPeriod.remaining,
                remainingChange,
                incomeAmount:currentPeriod.income,
                incomeChange,
                expensesAmount:currentPeriod.expenses,
                expensesChange:expensesChange*-1,
                categories:finalCategories,
                days:finalDays
            }
        })

    }catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting summary", error });
    }
    
})

export { router };