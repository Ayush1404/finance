import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Save, Trash } from "lucide-react";
import { NewTransactionErrorMessages } from "../Sheets/NewTransactionSheet";
import accountsAtom from "../../store/accountsAtom";
import { useRecoilState } from "recoil";
import { useMemo } from "react";
import categoriesAtom from "../../store/categoriesAtom";
import Select from "../select";

export type TransactionFormInput ={
  date:Date,
  accountId:string,
  categoryId:string,
  payee:string,
  amount:string,
  notes:string | null
}

type TransactionFormProps = {
  id?:string,
  values:
  {
    date:Date,
    accountId:string,
    categoryId:string,
    payee:string,
    amount:string,
    notes?:string | null
  },
  onSubmit:()=>void,
  onDelete:()=>void,
  disabled?:boolean,
  errors:NewTransactionErrorMessages,
  setValues:(value:Partial<TransactionFormInput>)=>void,
}

const TransactionForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues,
}:TransactionFormProps) => {
    const [accounts,setAccounts] = useRecoilState(accountsAtom)
    const accountOptions = useMemo(()=>accounts.map((account)=>({
        label:account.name,
        value:account.name
    })),[accounts])
    const [categories,setCategories] = useRecoilState(categoriesAtom)
    const categoryOptions = useMemo(()=>categories.map((category)=>({
        label:category.name,
        value:category.name
    })),[categories])
    return (
        <div>
        <div className="mt-8 grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Account</Label>
                <Select 
                    placeholder='Account'
                    options={accountOptions}
                    onChange={(value:string)=>{}}
                    value={''}
                    onCreate={(value?:string)=>{}}
                    disabled={false}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Category</Label>
                <Select 
                    placeholder='Category'
                    options={categoryOptions}
                    onChange={(value:string)=>{}}
                    value={''}
                    onCreate={(value?:string)=>{}}
                    disabled={false}
                />
            </div>
            <div className="grid gap-4 w-full">
            <Button 
                className="w-full"
                onClick={onSubmit}
                disabled={disabled}
            >
                {!id && <Plus className="mr-2"/>}
                {!!id && <Save className="mr-2"/>}
                {!id && 'Create Transaction'}
                {!!id && 'Save Changes'}
            </Button>
            {!!id && <Button 
                variant={'outline'} 
                className="w-full"
                onClick={onDelete}
                disabled={disabled}
            >
                <Trash size={20} className="mr-2"/>
                Delete Transaction
            </Button>}  
            </div>
        </div>
        </div>
    )
}

export default TransactionForm