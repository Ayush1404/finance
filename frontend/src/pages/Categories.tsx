import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { newCategorySheet } from "../store/sheetAtom"
import { useRecoilState, useSetRecoilState } from "recoil"
import { columns } from "../components/tables/categories/columns"
import { DataTable } from "../components/ui/data-table"
import axios from "axios"
import { toast } from "react-toastify"
import categoriesAtom from "../store/categoriesAtom"
import { Skeleton } from "../components/ui/skeleton"
import disabledAtom from "../store/disabledAtom"

const Categories = () => {
    const [categories,setCategories] = useRecoilState(categoriesAtom)
    const [loading,setLoading] = useState(false)
    const [disabled,setDisabled] = useRecoilState(disabledAtom)
    const setIsNewCategoryOpen = useSetRecoilState(newCategorySheet)
    const OpenNewCategorySheet = () => setIsNewCategoryOpen(true)
    
    const bulkDelete = async (Ids:string[]) =>{
        try {
            setDisabled(true)
            const token = localStorage.getItem('authToken');

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/category/bulkdelete`,{Ids},{
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Categories successfully deleted")
                setCategories(([...response.data.data ]));
            } else {
                console.log("Error deleting categories.")
            }
        } catch (err:any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setDisabled(false);
        }
    }
    
    const getCategoryData = async () =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                
                setCategories(([...response.data.data ]));
            } else {
                console.log("Error getting categories.")
            }
        } catch (err:any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        getCategoryData()
    },[])

    if(loading) return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-slate-300"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-2xl line-clamp-1">
                       Your Categories
                    </CardTitle>
                    <Button 
                        className="sm"
                        onClick={OpenNewCategorySheet}
                    >
                        <Plus className="size-4 mr-2"/> 
                        Add new category
                    </Button>
                </CardHeader>
                <CardContent>
                    <div>
                        <DataTable 
                            filterKey='name' 
                            columns={columns} 
                            data={categories} 
                            onDelete={(
                                rows
                            )=>{
                                const Ids = rows.map((row)=>row.original.id)
                                console.log(Ids)
                                bulkDelete(Ids)
                            }}
                            disabled={disabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Categories