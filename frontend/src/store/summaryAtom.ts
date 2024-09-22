import { atom } from "recoil"

type summaryData = {
    
    remainingAmount:number,
    remainingChange:number,
    incomeAmount:number,
    incomeChange:number,
    expensesAmount:number,
    expensesChange:number,
    categories:{
        name:string,
        value:number
    }[],
    days:{
        date:Date,
        income:number,
        expenses:number
    }[]
}
const summaryAtom = atom<summaryData>({
    key:'Summary',
    default:{
        remainingAmount:0,
        remainingChange:0,
        incomeAmount:0,
        incomeChange:0,
        expensesAmount:0,
        expensesChange:0,
        categories:[],
        days:[]
    }
})

export default summaryAtom;