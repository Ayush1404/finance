import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
//import TransactionActions from "../../Actions/TransactionActions"

export type Transaction = {
  id: string
  date:Date,
  payee:string,
  amount:string,
  accountId:string,
  categoryId:string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, 
  {
    id: "transactionsActions",
    cell: ({ row }) => (
      'HI'
      //<TransactionActions {...row.original} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
