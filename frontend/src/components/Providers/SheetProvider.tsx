import EditAccountSheet from "../Sheets/EditAccountSheet"
import EditCategorySheet from "../Sheets/EditCategory"
import NewAccountSheet from "../Sheets/NewAccountSheet"
import NewCategorySheet from "../Sheets/NewCategorySheet"

const SheetProvider = () => {
  return (
    <div>
        <NewAccountSheet />
        <EditAccountSheet />
        <NewCategorySheet />
        <EditCategorySheet />
    </div>
  )
}

export default SheetProvider