import { useSearchParams } from "react-router-dom"
import { convertAmountFromMiliUnits, formatDateRange } from "../../lib/utils"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { useRecoilValue } from "recoil"
import userAtom from "../../store/userAtom"
import DataCard, { DataCardLoading } from "./DataCard"
import { FaPiggyBank } from 'react-icons/fa'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

const DataGrid = () => {
    const [params] = useSearchParams()
    const to = params.get('to') || undefined
    const from = params.get('from') || undefined
    const [data,setData] =useState<{
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
    }>({
        remainingAmount:0,
        remainingChange:0,
        incomeAmount:0,
        incomeChange:0,
        expensesAmount:0,
        expensesChange:0,
        categories:[],
        days:[]
    })
    
    const dateRangeLabel = formatDateRange({to,from})

    const user = useRecoilValue(userAtom)
    const [loading,setLoading] = useState(false)
    const getAccountData = async () =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');
            const values = {
            accountId: '7',
            from: "2024-09-01",
            to: "2024-09-18"
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/summary`,{
                accountId: '7'
                },{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                const data = {
                    ...response.data.data,
                    remainingAmount:convertAmountFromMiliUnits(response.data.data.remainingAmount),
                    incomeAmount:convertAmountFromMiliUnits(response.data.data.incomeAmount),
                    expensesAmount:convertAmountFromMiliUnits(response.data.data.expensesAmount),
                    categories:response.data.data.categories.map((category:any)=>({
                    ...category,
                    value:convertAmountFromMiliUnits(category.value)
                    })),
                    days:response.data.data.days.map((day:any)=>({
                    ...day,
                    income:convertAmountFromMiliUnits(day.income),
                    expenses:convertAmountFromMiliUnits(day.expenses)
                    })),
                }   
                setData((prev)=>data)
                console.log(data)
                }else {
                    console.log("Error getting accounts.")
                }
        }catch (err:any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getAccountData()
    },[])

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