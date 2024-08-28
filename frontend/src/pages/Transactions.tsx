import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { newTransactionSheet } from "../store/sheetAtom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { columns } from "../components/tables/transactions/columns"
import { DataTable } from "../components/ui/data-table"
import axios from "axios"
import { toast } from "react-toastify"
import transactionsAtom from "../store/transactionsAtom"
import { Skeleton } from "../components/ui/skeleton"
import disabledAtom from "../store/disabledAtom"

const Transactions = () => {
    const [transactions,setTransactions] = useRecoilState(transactionsAtom)
    const [loading,setLoading] = useState(false)
    const [disabled,setDisabled] = useRecoilState(disabledAtom)
    const setIsNewTransactionOpen = useSetRecoilState(newTransactionSheet)
    const OpenNewTransactionSheet = () => setIsNewTransactionOpen(true)
    
    const bulkDelete = async (Ids:string[]) =>{
        try {
            setDisabled(true)
            const token = localStorage.getItem('authToken');

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/transaction/bulkdelete`,{Ids},{
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Transactions successfully deleted")
                setTransactions(([...response.data.data ]));
            } else {
                console.log("Error deleting transactions.")
            }
        } catch (err:any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setDisabled(false);
        }
    }
    
    const getTransactionData = async () =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transaction`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                
                setTransactions(([...response.data.data ]));
            } else {
                console.log("Error getting transactions.")
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
    
    useEffect(()=>{
        getTransactionData()
    },[])

    if(loading) return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-slate-300"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-2xl line-clamp-1">
                       Your Transactions
                    </CardTitle>
                    <Button 
                        className="sm"
                        onClick={OpenNewTransactionSheet}
                    >
                        <Plus className="size-4 mr-2"/> 
                        Add new transaction
                    </Button>
                </CardHeader>
                <CardContent>
                    <div>
                        <DataTable 
                            filterKey=""
                            columns={columns} 
                            data={transactions} 
                            onDelete={(
                                rows
                            )=>{
                                const Ids = rows.map((row)=>row.original.id)
                                console.log(Ids)
                                bulkDelete(Ids)
                            }}
                            disabled={disabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Transactions