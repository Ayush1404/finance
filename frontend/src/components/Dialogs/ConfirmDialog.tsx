import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRecoilState } from "recoil";
import { confrimationDialog } from "../../store/dialogAtom";

export const ConfirmDialogue= () => {
    const [confirm,setConfirm] = useRecoilState(confrimationDialog)
    return (
      <Dialog open={confirm.isOpen} onOpenChange={()=>
        setConfirm((prev)=>({
            ...prev,
            isOpen:false,
            title:"",
            primaryAction:()=>{},
            message:""
        }))  
      }>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirm.title}</DialogTitle>
          <DialogDescription>{confirm.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={
            ()=>setConfirm((prev)=>({
                ...prev,
                isOpen:false,
                title:"",
                primaryAction:()=>{},
                message:""
            }))  
          }>
            Cancel
          </Button>
          <Button onClick={
            async ()=>{
                await confirm.primaryAction()
                setConfirm((prev)=>({
                    ...prev,
                    isOpen:false,
                    title:"",
                    primaryAction:()=>{},
                    message:""
                }))  
            }
          }>Confirm</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};
