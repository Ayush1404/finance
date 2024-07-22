import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newAccountSheet } from "../../store/sheetAtom"
import { useState } from "react"
import AccountForm, { AccountFormInput } from "../forms/AccountForm"
import axios from "axios"
import { toast } from "react-toastify"
import accountsAtom from "../../store/accountsAtom"

export type NewAccountErrorMessages ={
    name?:string,
    [key: string]: string | undefined;
}
const NewAccountSheet = () => {
    const setAccounts = useSetRecoilState(accountsAtom)
    const [isOpen,setIsOpen] = useRecoilState(newAccountSheet)
    const onClose = () => setIsOpen(false)
    const [values,setValues] = useState({
        name:'',
    })
    const setValue = (newValues:Partial<AccountFormInput>) =>{
        setValues((values)=>({
            ...values,
            ...newValues
        }))
    }
    const [errors,setErrors] = useState<NewAccountErrorMessages>({})
    const [isLoading,setIsLoading] = useState(false)
    const addAccount = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                
                setAccounts((prev)=>([...prev,response.data.data]))
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
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
                    values={values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{}}
                    onSubmit={addAccount}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default NewAccountSheet