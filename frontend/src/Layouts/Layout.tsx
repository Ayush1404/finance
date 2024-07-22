import { ReactNode } from "react"
import Header from "../components/Header"
import SheetProvider from "../components/Providers/SheetProvider"
import DialogueProvider from "../components/Providers/DialogueProvider"

type LayoutProps ={
    children:ReactNode
}

const Layout = ({children}:LayoutProps) => {
  return (
    <>
        <SheetProvider />
        <DialogueProvider />
        <Header />
        <main  className="px-4 lg:px-14">
            {children}
        </main>
    </>
    
  )
}

export default Layout