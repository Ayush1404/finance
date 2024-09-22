import { Separator } from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { formatCurrency } from "../../lib/utils";

const CustomTooltip = ({active,payload}:any) => {
    if(!active) return null;
    const date = payload[0].payload.date
    const income = payload[0].payload.income
    const expenses = payload[0].payload.expenses

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {format(date,'MMM dd,yyyy')}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-blue-500 rounded-full" />
                            <p className="text-sm text-foreground-muted">
                                Income
                            </p>
                        </div>
                        <p className="text-sm text-right font-medium text-emerald-500">
                            {formatCurrency(income)}
                        </p>
                    </div>
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-blue-500 rounded-full" />
                            <p className="text-sm text-foreground-muted">
                                Expenses
                            </p>
                        </div>
                        <p className="text-sm text-right font-medium text-red-500">
                            {formatCurrency(expenses * -1)}
                        </p>
                    </div>
            </div>
        </div>
    )
}

export default CustomTooltip