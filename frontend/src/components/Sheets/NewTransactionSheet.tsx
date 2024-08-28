import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newTransactionSheet } from "../../store/sheetAtom"
import { useState } from "react"
import TransactionForm, { TransactionFormInput } from "../forms/TransactionForm"
import axios from "axios"
import { toast } from "react-toastify"
import transactionsAtom from "../../store/transactionsAtom"

export type NewTransactionErrorMessages ={
    [key: string]: string | undefined;
}
const NewTransactionSheet = () => {
    const setTransactions = useSetRecoilState(transactionsAtom)
    const [isOpen,setIsOpen] = useRecoilState(newTransactionSheet)
    const onClose = () => setIsOpen(false)
    const [values,setValues] = useState({
        date: new Date(),
        accountId:'',
        categoryId:'',
        payee:'',
        amount:'',
    })
    const setValue = (newValues:Partial<TransactionFormInput>) =>{
        setValues((values)=>({
            ...values,
            ...newValues
        }))
    }
    const [errors,setErrors] = useState<NewTransactionErrorMessages>({})
    const [isLoading,setIsLoading] = useState(false)
    const addTransaction = async () => {
        try {
           console.log(values)
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } 
            else if (err.response?.data?.message) {
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
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Create a new transaction to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <TransactionForm
                    values={values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{}}
                    onSubmit={addTransaction}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default NewTransactionSheet