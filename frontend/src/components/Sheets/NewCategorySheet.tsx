import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newCategorySheet } from "../../store/sheetAtom"
import { useState } from "react"
import CategoryForm, { CategoryFormInput } from "../forms/CategoryForm"
import axios from "axios"
import { toast } from "react-toastify"
import categoriesAtom from "../../store/categoriesAtom"

export type NewCategoryErrorMessages ={
    name?:string,
    [key: string]: string | undefined;
}
const NewCategorySheet = () => {
    const setCategories = useSetRecoilState(categoriesAtom)
    const [isOpen,setIsOpen] = useRecoilState(newCategorySheet)
    const onClose = () => setIsOpen(false)
    const [values,setValues] = useState({
        name:'',
    })
    const setValue = (newValues:Partial<CategoryFormInput>) =>{
        setValues((values)=>({
            ...values,
            ...newValues
        }))
    }
    const [errors,setErrors] = useState<NewCategoryErrorMessages>({})
    const [isLoading,setIsLoading] = useState(false)
    const addCategory = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/category/`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                
                setCategories((prev)=>([...prev,response.data.data]))
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
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
                    values={values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{}}
                    onSubmit={addCategory}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default NewCategorySheet