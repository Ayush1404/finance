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
import { DatePicker } from "../date-picker";
import { Textarea } from "../ui/textarea";
import AmountInput from "../ui/amount-input";

export type TransactionFormInput = {
  date: Date,
  accountId: string,
  categoryId: string,
  payee: string,
  amount: string,
  notes: string | null
}

type TransactionFormProps = {
  id?: string,
  values: TransactionFormInput,
  onSubmit: () => void,
  onDelete: () => void,
  disabled?: boolean,
  errors: NewTransactionErrorMessages,
  setValues: (value: Partial<TransactionFormInput>) => void,
}

const TransactionForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues,
}: TransactionFormProps) => {
    const [accounts] = useRecoilState(accountsAtom)
    const accountOptions = useMemo(() => accounts.map((account) => ({
        label: account.name,
        value: account.id
    })), [accounts])
    const [categories] = useRecoilState(categoriesAtom)
    const categoryOptions = useMemo(() => categories.map((category) => ({
        label: category.name,
        value: category.id
    })), [categories])

    return (
        <div>
        <div className="mt-8 grid gap-4">
            <div className="grid gap-2">
                <DatePicker 
                    value={values.date}
                    disabled={disabled || false}
                    onChange={(e) => setValues({
                        date: e
                    })}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select 
                    placeholder='Account'
                    options={accountOptions}
                    onChange={(value: string) => setValues({accountId: value})}
                    value={values.accountId}
                    onCreate={(value?: string) => {}}
                    disabled={disabled}
                />
                {errors.accountId && <p className="text-sm text-red-400">{errors.accountId}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                    placeholder='Category'
                    options={categoryOptions}
                    onChange={(value: string) => setValues({categoryId: value})}
                    value={values.categoryId}
                    onCreate={(value?: string) => {}}
                    disabled={disabled}
                />
                {errors.categoryId && <p className="text-sm text-red-400">{errors.categoryId}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="payee">Payee</Label>
                <Input 
                    id="payee" 
                    type="text" 
                    placeholder="Enter payee" 
                    value={values.payee}
                    onChange={(e) => setValues({payee: e.target.value})}
                    disabled={disabled}
                />
                {errors.payee && <p className="text-sm text-red-400">{errors.payee}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                    id="notes" 
                    placeholder="Add optional notes"
                    value={values.notes || ''}
                    onChange={(e) => setValues({notes: e.target.value})}
                    disabled={disabled}
                />
                {errors.notes && <p className="text-sm text-red-400">{errors.notes}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <AmountInput 
                    placeholder="0.00"
                    disabled={disabled}
                    onChange={(value) => setValues({amount: value})}
                    value={values.amount}
                />
                {errors.amount && <p className="text-sm text-red-400">{errors.amount}</p>}
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