import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newTransactionSheet } from "../../store/sheetAtom"
import { useState } from "react"
import TransactionForm, { TransactionFormInput } from "../forms/TransactionForm"
import axios from "axios"
import { toast } from "react-toastify"
import transactionsAtom from "../../store/transactionsAtom"
import { convertAmountToMiliUnits } from "../../lib/utils"

export type NewTransactionErrorMessages = {
    [key: string]: string | undefined;
}

type TransactionState = {
    date: Date;
    accountId: string;
    categoryId: string;
    payee: string;
    amount: string;
    notes: string;
}

const NewTransactionSheet = () => {
    const setTransactions = useSetRecoilState(transactionsAtom)
    const [isOpen, setIsOpen] = useRecoilState(newTransactionSheet)
    const onClose = () => setIsOpen(false)
    const [values, setValues] = useState<TransactionState>({
        date: new Date(),
        accountId: '',
        categoryId: '',
        payee: '',
        amount: '',
        notes: '',  
    })
    const setValue = (newValues: Partial<TransactionFormInput>) => {
        setValues((prevValues) => ({
            ...prevValues,
            ...newValues,
            notes: newValues.notes ?? prevValues.notes,
        }))
    }
    const [errors, setErrors] = useState<NewTransactionErrorMessages>({})
    const [isLoading, setIsLoading] = useState(false)

    const addTransaction = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('authToken')
            
            // Convert amount to BigInt
            const amountInCents = BigInt(Math.round(convertAmountToMiliUnits(parseFloat(values.amount))))
            
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/transaction`,
                {
                    payee: values.payee,
                    amount: amountInCents.toString(), 
                    notes: values.notes || '', 
                    date: values.date.toISOString(),
                    accountId: parseInt(values.accountId),
                    categoryId: values.categoryId ? parseInt(values.categoryId) : null,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            )

            if (response.data.success) {
                toast.success("Transaction added successfully")
                setTransactions((prevTransactions) => [...prevTransactions, response.data.data])
                onClose() // Close the sheet after successful addition
            } else {
                toast.error("Error adding transaction")
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors)
            } 
            else if (err.response?.data?.message) {
                toast.error(err.response.data.message)
            }
            else {
                console.log(err)
                toast.error("Something went wrong!")
            }
        } finally {
            setIsLoading(false)
        }
    }
    
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
                    onDelete={() => {}}
                    onSubmit={addTransaction}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
    )
}

export default NewTransactionSheet