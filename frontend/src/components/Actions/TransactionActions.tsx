import { DropdownMenu, DropdownMenuContent , DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { useRecoilState, useSetRecoilState } from "recoil"
import { editTransactionSheet } from "../../store/sheetAtom"
import disabledAtom from "../../store/disabledAtom"
import { toast } from "react-toastify"
import transactionsAtom from "../../store/transactionsAtom"
import axios from "axios"
import { confrimationDialog } from "../../store/dialogAtom"
import { convertAmountFromMiliUnits } from "../../lib/utils"

type ActionsProps ={
    id:string,
    date: Date,
    accountId: string,
    categoryId: string,
    payee: string,
    amount: string,
    notes: string | null, 
}
const Actions = ({
    id,
    date,
    accountId,
    categoryId,
    payee,
    amount,
    notes, 
}:ActionsProps) => {
    const setTransactions = useSetRecoilState(transactionsAtom)
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [disabled,setDisabled] = useRecoilState(disabledAtom)
    const setEditTransactionSheetState = useSetRecoilState(editTransactionSheet)
    const deleteTransaction = async () => {
        try {
            setDisabled(true); 
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transaction/:${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setTransactions((prev)=>prev.filter((transaction)=>transaction.id !==response.data.data.id))
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
                console.log(err)
            }
        } finally {
            setDisabled(false); // Set loading to false
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant={'ghost'}
                    className="p-0 size-8"
                >
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    disabled={disabled}
                    onClick={()=>{
                        setEditTransactionSheetState({
                            isOpen:true,
                            id,
                            values:{
                                id,
                                date,
                                accountId,
                                categoryId,
                                payee,
                                amount:convertAmountFromMiliUnits(parseFloat(amount)).toString(),
                                notes,
                            }
                        })
                    }}
                >
                    <Edit className="size-4 mr-2"/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={disabled}
                    onClick={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteTransaction,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this transaction"
                        }))
                    }}
                >
                    <Trash className="size-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Actions