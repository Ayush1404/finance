import { Info, MinusCircle, PlusCircle } from "lucide-react"
import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import CurrencyInput from 'react-currency-input-field'
type AmountInputProps = {
    value:string
    onChange:(value:string|undefined)=>void
    placeholder?:string
    disabled?:boolean
}

const AmountInput = ({
    value,
    onChange,
    placeholder,
    disabled
}:AmountInputProps) => {
    const parsedValue =  parseFloat(value)
    const isIncome = parsedValue > 0 
    const isExpense = parsedValue < 0 

    const onReverseValue = () =>{
        if(!value)return;
        onChange((parseFloat(value)*-1).toString())
    }

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button 
                            type="button" 
                            onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",isIncome && 'bg-emerald-500 hover:bg-emerald-600', isExpense && 'bg-rose-500 hover:bg-rose-600'
                            )}
                        > 
                            {!parsedValue && <Info className="size-3 text-white"/>}
                            {isIncome && <PlusCircle className="size-3 text-white"/>}
                            {isExpense && <MinusCircle className="size-3 text-white"/>}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput 
                prefix=" RS "
                className="pl-10 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                placeholder={placeholder}
                value={value}
                decimalScale={2}
                decimalsLimit={2}   
                onValueChange={(e)=>onChange(e)}  
                disabled={disabled}   
            />
            <p className={cn("text-xs text-muted-foreground mt-2",isIncome && 'text-emerald-500',isExpense && 'text-rose-500')}>
                { isIncome && 'This will count as income'}
                { isExpense && 'This will count as expense'}
            </p>
        </div>
    )
}

export default AmountInput