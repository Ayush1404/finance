import EditAccountSheet from "../Sheets/EditAccountSheet"
import EditCategorySheet from "../Sheets/EditCategory"
import NewAccountSheet from "../Sheets/NewAccountSheet"
import NewCategorySheet from "../Sheets/NewCategorySheet"
import NewTransactionSheet from "../Sheets/NewTransactionSheet"

const SheetProvider = () => {
  return (
    <div>
        <NewAccountSheet />
        <EditAccountSheet />
        <NewCategorySheet />
        <EditCategorySheet />
        <NewTransactionSheet />
        
    </div>
  )
}

export default SheetProvider