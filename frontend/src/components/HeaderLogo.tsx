import { Link } from "react-router-dom"

const HeaderLogo = () => {
  return (
    <Link to={'/'}>
        <div className="items-center hidden lg:flex">
            <img src="/logo.svg" alt="logo" height={28} width={28}/>
            <p className="font-semibold text-white text-2xl ml-2.5">
                Finance
            </p>
        </div>
    </Link>
  )
}

export default HeaderLogo