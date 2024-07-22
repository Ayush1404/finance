import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import CategoryActions from "../../Actions/CategoryActions"

export type Category = {
  id: string
  name: string
}

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            className="pl-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        )
    },
  },
  {
    id: "categoryActions",
    cell: ({ row }) => (
      <CategoryActions {...row.original} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
