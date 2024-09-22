import { eachDayOfInterval, isSameDay } from "date-fns";

export function calculatePercentageChange(
    current:number,
    previous:number
){
    if(previous===0)
    {
      return previous===current?0:100;
    }
    return ((current - previous)/previous)*100
}

export function fillMissingDates(
    activeDays:{
        date:Date,
        income:number
        expenses:number
    }[],
    startDate:Date,
    endDate:Date
){
    if(activeDays.length === 0)return[]

    const allDays = eachDayOfInterval({
        start:startDate,
        end:endDate
    })

    const newActiveDays = allDays.map((date)=>{
        const found = activeDays.find((day)=>isSameDay(day.date,date))
        if(found) return found;
        return{
            date,
            income:0,
            expenses:0
        }
    })

    return newActiveDays
}