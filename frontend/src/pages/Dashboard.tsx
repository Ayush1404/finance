import { useRecoilValue } from "recoil"
import userAtom from "../store/userAtom"

const Dashboard = () => {
  const user = useRecoilValue(userAtom)
  
  return (
    <div>
      id:{user.id}
      
    </div>
  )
}

export default Dashboard