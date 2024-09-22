import { useRecoilValue } from "recoil"
import DataCard, { DataCardLoading } from "./DataCard"
import { FaPiggyBank } from 'react-icons/fa'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"
import summaryAtom from "../../store/summaryAtom"

type DataGridProps = {
    loading:boolean
    dateRangeLabel:string
} 

const DataGrid = ({
    loading,
    dateRangeLabel
}:DataGridProps) => {
    
    const data = useRecoilValue(summaryAtom)

    if(loading)
    {
        return(
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard 
                title='Remaining'
                value={data.remainingAmount}
                percentageChange={data.remainingChange}
                icon={FaPiggyBank}
                variant='default'
                dateRange={dateRangeLabel}
            />
            <DataCard 
                title='Income'
                value={data.incomeAmount}
                percentageChange={data.incomeChange}
                icon={FaArrowTrendUp}
                variant='success'
                dateRange={dateRangeLabel}
            />
            <DataCard 
                title='Expenses'
                value={data.expensesAmount}
                percentageChange={data.expensesChange}
                icon={FaArrowTrendDown}
                variant='danger'
                dateRange={dateRangeLabel}
            />
        </div>
    )
}

export default DataGrid