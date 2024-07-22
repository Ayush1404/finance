import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { editAccountSheet } from "../../store/sheetAtom"
import { useState } from "react"
import AccountForm, { AccountFormInput } from "../forms/AccountForm"
import axios from "axios"
import { toast } from "react-toastify"
import accountsAtom from "../../store/accountsAtom"
import { confrimationDialog } from "../../store/dialogAtom"

export type EditAccountErrorMessages ={
    name?:string,
    [key: string]: string | undefined;
}
const EditAccountSheet = () => {
    const setAccounts = useSetRecoilState(accountsAtom)
    const [editAccountSheetState,setEditAccountSheetState] = useRecoilState(editAccountSheet)
    const onClose = () => setEditAccountSheetState({
        isOpen:false,
        id:'',
        values:{
            name:''
        }
    })
    
    const setValue = (newValues:Partial<AccountFormInput>) =>{
        setEditAccountSheetState((prev)=>({
            ...prev,
            values:{
                ...prev.values,
                ...newValues
            }
        }))
    }

    const [errors,setErrors] = useState<EditAccountErrorMessages>({})
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [isLoading,setIsLoading] = useState(false)

    const editAccount = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/account/:${editAccountSheetState.id}`, editAccountSheetState.values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAccounts((prev)=>prev.map((account)=>account.id===response.data.data._id ? {
                    ...account,
                    name:response.data.data.name
                }:account))
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
    
    const deleteAccount = async () => {
        try {
            setIsLoading(true); // Set loading to true  
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/account/:${editAccountSheetState.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAccounts((prev)=>prev.filter((account)=>account.id !==response.data.data._id))
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
        <Sheet open={editAccountSheetState.isOpen} onOpenChange={onClose}>
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
                    id={editAccountSheetState.id}
                    values={editAccountSheetState.values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteAccount,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this account"
                        }))
                    }}
                    onSubmit={editAccount}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default EditAccountSheet