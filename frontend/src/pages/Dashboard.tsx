import { toast } from "react-toastify"
import DataGrid from "../components/Dashboard/DataGrid"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import summaryAtom from "../store/summaryAtom"
import { useSetRecoilState } from "recoil"
import axios from "axios"
import { convertAmountFromMiliUnits, formatDateRange } from "../lib/utils"
import DataCharts from "../components/Dashboard/DataCharts"
import accountsAtom from "../store/accountsAtom"
import { format } from "date-fns"

const Dashboard = () => {
  const setAccounts = useSetRecoilState(accountsAtom)
  const [params] = useSearchParams()
  const accountId = params.get('accountId') || 'all'
  const to = params.get('to') 
  const from = params.get('from') 
  const dateRangeLabel = formatDateRange({to,from})
    
  const setData = useSetRecoilState(summaryAtom)
  const [loading,setLoading] = useState(false)
  const getAccountData = async () =>{
    try {
        setLoading(true)
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account`, {
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            
            setAccounts(([...response.data.data ]));
        } else {
            console.log("Error getting accounts.")
        }
    } catch (err:any) {
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
  const getSummaryData = async () => {
      try {
          setLoading(true)
          const token = localStorage.getItem('authToken');
          
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/summary`,{
                accountId,
                from: from ? format(from,'yyyy-MM-dd'):null,
                to: to ? format(to,'yyyy-MM-dd'):null
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
      }finally {
          setLoading(false);
      }
  }

  useEffect(()=>{
      getAccountData()
      getSummaryData()
  },[params])

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid dateRangeLabel={dateRangeLabel} loading={loading}/>
      <DataCharts loading={loading}/>
    </div>
  )
}

export default Dashboard