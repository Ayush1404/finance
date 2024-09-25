import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "./ui/button"
import { Popover, PopOverClose, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format, subDays } from "date-fns"
import { formatDateRange } from "../lib/utils"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import qs from 'query-string'
import { ChevronDown } from "lucide-react"
import { Calendar } from "./ui/calendar"


const DateFilter = () => {
    const [params] = useSearchParams()
    const pathname = useLocation().pathname
    const accountId = params.get('accountId') || 'all'
    const from = params.get('from') || null
    const to = params.get('to') || null
    const navigate = useNavigate()

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo,30); 

    const paramState = {
        from : from ? new Date(from) : defaultFrom,
        to : to ? new Date(to) : defaultTo
    }

    const [date,setDate] = useState<DateRange | undefined>(paramState)
    
    


    const pushToUrl = (dateRange:DateRange | undefined) =>{
        const query = {
            from:format(dateRange?.from || defaultFrom , "yyyy-MM-dd"),
            to:format(dateRange?.to || defaultTo , "yyyy-MM-dd"),
            accountId
        }

        const url = qs.stringifyUrl({
            url:pathname,
            query
        },{ skipNull: false , skipEmptyString : true})

        navigate(url)
         
    }

    const onReset = () => {
        setDate(undefined)
        pushToUrl(undefined)
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    disabled={false}
                    size='sm'
                    variant='outline'
                    className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 mt-2 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
                >
                    <span>{formatDateRange(paramState)}</span>
                    <ChevronDown className="ml-2 size-4 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="lg:w-auto w-full p-0"
                align="start"
            >
                <Calendar 
                    disabled={false}
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                <div className="p-4 w-full flex items-center gap-x-2">
                    <PopOverClose>
                        <Button
                            onClick={onReset}
                            disabled={!date?.from || !date.to}
                            className="w-full"
                            variant='outline'
                        >
                            Reset
                        </Button>
                    </PopOverClose>
                    <PopOverClose>
                        <Button
                            onClick={()=>pushToUrl(date)}
                            disabled={!date?.from || !date.to}
                            className="w-full"
                            variant='outline'
                        >
                            Apply
                        </Button>
                    </PopOverClose>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateFilter