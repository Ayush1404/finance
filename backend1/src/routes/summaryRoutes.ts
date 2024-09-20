import { subDays , parse, differenceInDays } from "date-fns";
import { authenticateJwt } from "../middlewares/authMiddleware";
import { summaryFilterValidate } from "../middlewares/validators";
import { Request, Response } from 'express';
import { prisma } from "../config/dbconfig";

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
                SUM(CASE WHEN amount::numeric > 0 THEN amount::numeric ELSE 0 END) AS income,
                SUM(CASE WHEN amount::numeric < 0 THEN amount::numeric ELSE 0 END) AS expenses,
                SUM(amount::numeric) AS remaining
              FROM "Transaction"
    
              WHERE "userId" = ${parseInt(userId)}
                AND "accountId" = ${parseInt(accountId)}
                AND "date" >= ${startDate}
                AND "date" <= ${endDate}
            `;
          
            return result; 
        }
        
        console.log(req.headers.id,startDate,endDate,accountId)
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
            startDate,
            endDate
        )

        return res.status(200).send({
            success:true,
            data:{
                currentPeriod,
                lastPeriod
            }
        })

    }catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting summary", error });
    }
    
})

export { router };