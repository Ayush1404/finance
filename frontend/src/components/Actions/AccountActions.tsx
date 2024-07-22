import { DropdownMenu, DropdownMenuContent , DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { useRecoilState, useSetRecoilState } from "recoil"
import { editAccountSheet } from "../../store/sheetAtom"
import disabledAtom from "../../store/disabledAtom"
import { toast } from "react-toastify"
import accountsAtom from "../../store/accountsAtom"
import axios from "axios"
import { confrimationDialog } from "../../store/dialogAtom"

type ActionsProps ={
    id:string,
    name:string
}
const Actions = ({
    id,
    name
}:ActionsProps) => {
    const setAccounts = useSetRecoilState(accountsAtom)
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [disabled,setDisabled] = useRecoilState(disabledAtom)
    const setEditAccountSheetState = useSetRecoilState(editAccountSheet)
    const deleteAccount = async () => {
        try {
            setDisabled(true); 
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/account/:${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAccounts((prev)=>prev.filter((account)=>account.id !==response.data.data._id))
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
                        setEditAccountSheetState({
                            isOpen:true,
                            id,
                            values:{
                                name
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
                            primaryAction:deleteAccount,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this account"
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