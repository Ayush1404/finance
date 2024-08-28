import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { editAtransactionSheet } from "../../store/sheetAtom"
import { useState } from "react"
import AtransactionForm, { AtransactionFormInput } from "../forms/AtransactionForm"
import axios from "axios"
import { toast } from "react-toastify"
import atransactionsAtom from "../../store/atransactionsAtom"
import { confrimationDialog } from "../../store/dialogAtom"

export type EditAtransactionErrorMessages ={
    name?:string,
    [key: string]: string | undefined;
}
const EditAtransactionSheet = () => {
    const setAtransactions = useSetRecoilState(atransactionsAtom)
    const [editAtransactionSheetState,setEditAtransactionSheetState] = useRecoilState(editAtransactionSheet)
    const onClose = () => setEditAtransactionSheetState({
        isOpen:false,
        id:'',
        values:{
            name:''
        }
    })
    
    const setValue = (newValues:Partial<AtransactionFormInput>) =>{
        setEditAtransactionSheetState((prev)=>({
            ...prev,
            values:{
                ...prev.values,
                ...newValues
            }
        }))
    }

    const [errors,setErrors] = useState<EditAtransactionErrorMessages>({})
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [isLoading,setIsLoading] = useState(false)

    const editAtransaction = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/atransaction/:${editAtransactionSheetState.id}`, editAtransactionSheetState.values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAtransactions((prev)=>prev.map((atransaction)=>atransaction.id===response.data.data.id ? {
                    ...atransaction,
                    name:response.data.data.name
                }:atransaction))
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
    
    const deleteAtransaction = async () => {
        try {
            setIsLoading(true); // Set loading to true  
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/atransaction/:${editAtransactionSheetState.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAtransactions((prev)=>prev.filter((atransaction)=>atransaction.id !==response.data.data.id))
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
        <Sheet open={editAtransactionSheetState.isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Atransaction
                    </SheetTitle>
                    <SheetDescription>
                        Create a new atransaction to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AtransactionForm
                    id={editAtransactionSheetState.id}
                    values={editAtransactionSheetState.values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteAtransaction,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this atransaction"
                        }))
                    }}
                    onSubmit={editAtransaction}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default EditAtransactionSheet