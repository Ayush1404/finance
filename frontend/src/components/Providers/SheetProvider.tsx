import EditAccountSheet from "../Sheets/EditAccountSheet"
import EditCategorySheet from "../Sheets/EditCategory"
import EditTransactionSheet from "../Sheets/EditTransactionSheet"
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
        <EditTransactionSheet />
    </div>
  )
}

export default SheetProvider