import { useRecoilValue } from "recoil"
import userAtom from "../store/userAtom"

const WelcomeMsg = () => {
    const user = useRecoilValue(userAtom)
    return (
    <div className="space-y-2 mb=4">
        <h2 className="text-2xl lg:text-4xl text-white font-medium ">
            Welcome back , {user.name} 
        </h2>
        <p className="text-sm lg:text-base text-[#89B6FD]">
            This is your Financial Overview Report
        </p>
        
    </div>
  )
}

export default WelcomeMsg