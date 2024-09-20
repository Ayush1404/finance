import { useRecoilValue } from "recoil"
import userAtom from "../store/userAtom"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const Dashboard = () => {
  const user = useRecoilValue(userAtom)
  const [loading,setLoading] = useState(false)
  const getAccountData = async () =>{
    try {
        setLoading(true)
        const token = localStorage.getItem('authToken');
        const values = {
          accountId: '7',
          from: "2024-09-01",
          to: "2024-09-18"
        }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/summary`,{
          accountId: '7'
        },{
          headers: {
            'Authorization': `Bearer ${token}`,
            },
        });
        if (response.data.success) {   
          console.log(response.data)
        } else {
            console.log("Error getting accounts.")
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
      getAccountData()
  },[])
  return (
    <div>
      id:{user.id}
      
    </div>
  )
}

export default Dashboard