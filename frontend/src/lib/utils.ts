import { type ClassValue, clsx } from "clsx"
import { format, subDays } from "date-fns"
import { twMerge } from "tailwind-merge"

type Period = {
  from:Date | undefined |  string 
  to:Date | undefined |  string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliUnits (amount:number) {
  return amount / 1000;
}

export function convertAmountToMiliUnits (amount:number) {
  return Math.round( amount * 1000 )
}

export function formatCurrency(amount:number){
  return Intl.NumberFormat('en-US', {
    style:'currency',
    currency:'INR',
    minimumFractionDigits:2
  }).format(amount)
}

export function formatDateRange(period?:Period){
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo,30);
  if(!period?.from)
  {
    return `${format(defaultFrom,"LLL dd")} - ${format(defaultTo,"LLL dd,y")}`
  }

  if(period?.to)
  {
    return `${format(period.from,"LLL dd")} - ${format(period.to,"LLL dd,y")}`
  }

  return `${format(period.from,"LLL dd")}`
}

export function formatPercentage(
  value:number,
  options:{ addPrefix : boolean} = {
    addPrefix:false
  }
){
  const  result = Intl.NumberFormat('en-US', {
    style:'percent'
  }).format(value/100)

  if(options.addPrefix && value > 0)
  {
    return `+${result}`
  }

  return result
}
