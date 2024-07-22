import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { editCategorySheet } from "../../store/sheetAtom"
import { useState } from "react"
import CategoryForm, { CategoryFormInput } from "../forms/CategoryForm"
import axios from "axios"
import { toast } from "react-toastify"
import categoriesAtom from "../../store/categoriesAtom"
import { confrimationDialog } from "../../store/dialogAtom"

export type EditCategoryErrorMessages ={
    name?:string,
    [key: string]: string | undefined;
}
const EditCategorySheet = () => {
    const setCategories = useSetRecoilState(categoriesAtom)
    const [editCategorySheetState,setEditCategorySheetState] = useRecoilState(editCategorySheet)
    const onClose = () => setEditCategorySheetState({
        isOpen:false,
        id:'',
        values:{
            name:''
        }
    })
    
    const setValue = (newValues:Partial<CategoryFormInput>) =>{
        setEditCategorySheetState((prev)=>({
            ...prev,
            values:{
                ...prev.values,
                ...newValues
            }
        }))
    }

    const [errors,setErrors] = useState<EditCategoryErrorMessages>({})
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [isLoading,setIsLoading] = useState(false)

    const editCategory = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/category/:${editCategorySheetState.id}`, editCategorySheetState.values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setCategories((prev)=>prev.map((category)=>category.id===response.data.data._id ? {
                    ...category,
                    name:response.data.data.name
                }:category))
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
    
    const deleteCategory = async () => {
        try {
            setIsLoading(true); // Set loading to true  
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/category/:${editCategorySheetState.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setCategories((prev)=>prev.filter((category)=>category.id !==response.data.data._id))
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
        <Sheet open={editCategorySheetState.isOpen} onOpenChange={onClose}>
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
                    id={editCategorySheetState.id}
                    values={editCategorySheetState.values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteCategory,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this category"
                        }))
                    }}
                    onSubmit={editCategory}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default EditCategorySheet