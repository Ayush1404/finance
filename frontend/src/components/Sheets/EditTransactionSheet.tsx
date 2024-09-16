import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { editTransactionSheet } from "../../store/sheetAtom"
import { useState } from "react"
import TransactionForm, { TransactionFormInput } from "../forms/TransactionForm"
import axios from "axios"
import { toast } from "react-toastify"
import TransactionsAtom from "../../store/transactionsAtom"
import { confrimationDialog } from "../../store/dialogAtom"
import { convertAmountFromMiliUnits, convertAmountToMiliUnits } from "../../lib/utils"

export type EditAtransactionErrorMessages ={
    [key: string]: string | undefined;
}
const EditTransactionSheet = () => {
    const setTransactions = useSetRecoilState(TransactionsAtom)
    const [editTransactionSheetState,setEditTransactionSheetState] = useRecoilState(editTransactionSheet)
    const onClose = () => setEditTransactionSheetState({
        isOpen:false,
        id:'',
        values:{
            id:'',
            date: new Date(),
            accountId: '',
            categoryId: '',
            payee: '',
            amount: '',
            notes: '',  
        }
    })
    
    const setValue = (newValues:Partial<TransactionFormInput>) =>{
        
        setEditTransactionSheetState((prev)=>{
            return({
                ...prev,
                values:{
                    ...prev.values,
                    ...newValues
                }
            })
        })
    }

    const [errors,setErrors] = useState<EditAtransactionErrorMessages>({})
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [isLoading,setIsLoading] = useState(false)

    const editTransaction = async () => {
        try {
            setIsLoading(true); 
            setErrors({}); 
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }
            const amountInCents = BigInt(Math.round(convertAmountToMiliUnits(parseFloat(editTransactionSheetState.values.amount))))
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/transaction/:${editTransactionSheetState.id}`,
                {
                    ...editTransactionSheetState.values,
                    amount:amountInCents.toString()
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setTransactions((prev)=>prev.map((transaction)=>transaction.id===response.data.data.id ? {
                    ...transaction,
                    date: response.data.data.date,
                    accountId: response.data.data.accountId,
                    categoryId: response.data.data.categoryId,
                    payee: response.data.data.payee,
                    amount: response.data.data.amount,
                    notes: response.data.data.notes, 
                    account : response.data.data.account,
                    category : response.data.data.category,
                }:transaction))
                onClose()
                toast.success(response?.data.message);
            } else {
              toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } 
            else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
                console.log(err)
            }
        } finally {
            setIsLoading(false); 
        }
    };
    
    const deleteTransaction = async () => {
        try {
            setIsLoading(true); 
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transaction/:${editTransactionSheetState.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setTransactions((prev)=>prev.filter((transaction)=>transaction.id !==response.data.data.id))
                onClose()
                toast.success(response?.data.message);
            } else {
              toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    return (
        <Sheet open={editTransactionSheetState.isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit your transaction here.
                    </SheetDescription>
                </SheetHeader>
                <TransactionForm
                    id={editTransactionSheetState.id}
                    values={editTransactionSheetState.values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteTransaction,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this transaction"
                        }))
                    }}
                    onSubmit={editTransaction}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default EditTransactionSheet