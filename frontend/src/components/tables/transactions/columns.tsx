import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { format } from "date-fns"
import { convertAmountFromMiliUnits, formatCurrency } from "../../../lib/utils"
import { Badge } from "../../ui/badge"
import TransactionActions from "../../Actions/TransactionActions"

export type Transaction = {
  id: string
  date:Date,
  payee:string,
  amount:string,
  accountId:string,
  categoryId:string
  notes:string|null
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
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as Date
      return <span>{format(date, "dd MMMM , yyyy")}</span>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      
      <span>{(row.original as Transaction & { category: { name: string } }).category?.name || 'Uncategorized'}</span>
    ),
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.payee}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      return (
        <Badge
          variant={amount < 0 ? 'red' : 'primary'}
          className="text-xs font-medium px-3.5  py-2.5"
        >
          {formatCurrency(convertAmountFromMiliUnits(amount))}
        </Badge>
      )
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{(row.original as Transaction & { account: { name: string } }).account?.name || 'No account'}</span>
    ),
  },
  {
    id: "transactionsActions",
    cell: ({ row }) => (
      <TransactionActions {...row.original} notes={row.original.notes || ''}/>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
