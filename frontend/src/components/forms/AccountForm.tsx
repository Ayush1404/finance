import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewAccountErrorMessages } from "../Sheets/NewAccountSheet";
import { Plus, Save, Trash } from "lucide-react";

export type AccountFormInput ={
  name:string
}

type AccountFormProps = {
  id?:string,
  values:
  {
    name:string
  },
  onSubmit:()=>void,
  onDelete:()=>void,
  disabled?:boolean,
  errors:NewAccountErrorMessages,
  setValues:(value:Partial<AccountFormInput>)=>void
}

const AccountForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues
}:AccountFormProps) => {

  return (
    <div>
      <div className="mt-8 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            type="name" 
            placeholder="e.g. Cash , Saving" 
            value={values.name}
            onChange={(e)=>setValues({name:e.target.value})}
            disabled={disabled}
          />
          {errors.name && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.name}
            </p>
          </div>}
        </div>
        <div className="grid gap-4 w-full">
          <Button 
            className="w-full"
            onClick={onSubmit}
            disabled={disabled}
          >
            {!id && <Plus className="mr-2"/>}
            {!!id && <Save className="mr-2"/>}
            {!id && 'Create Account'}
            {!!id && 'Save Changes'}
          </Button>
          {!!id && <Button 
            variant={'outline'} 
            className="w-full"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash size={20} className="mr-2"/>
            Delete Account
          </Button>}  
        </div>
      </div>
    </div>
  )
}

export default AccountForm