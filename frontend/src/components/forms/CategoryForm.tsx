import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewCategoryErrorMessages } from "../Sheets/NewCategorySheet";
import { Plus, Save, Trash } from "lucide-react";

export type CategoryFormInput ={
  name:string
}

type CategoryFormProps = {
  id?:string,
  values:
  {
    name:string
  },
  onSubmit:()=>void,
  onDelete:()=>void,
  disabled?:boolean,
  errors:NewCategoryErrorMessages,
  setValues:(value:Partial<CategoryFormInput>)=>void
}

const CategoryForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues
}:CategoryFormProps) => {

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
            {!id && 'Create Category'}
            {!!id && 'Save Changes'}
          </Button>
          {!!id && <Button 
            variant={'outline'} 
            className="w-full"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash size={20} className="mr-2"/>
            Delete Category
          </Button>}  
        </div>
      </div>
    </div>
  )
}

export default CategoryForm