import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Inbox } from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (prop: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  className?: string
}

export function DataTable<T extends { id?: string | number, loan_id?: string | number, customer_id?: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  className
}: DataTableProps<T>) {
  if (!Array.isArray(data)) {
    return (
       <div className="flex flex-col justify-center items-center p-12 border border-slate-200 border-dashed rounded-2xl bg-slate-50/50 text-slate-500">
        <Inbox className="w-10 h-10 mb-4 text-slate-300" />
        <h3 className="font-semibold text-slate-900 mb-1">Invalid Data</h3>
        <p className="text-sm">Cannot display table data correctly.</p>
      </div>     
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16 px-6 border border-slate-200 border-dashed rounded-2xl bg-white shadow-sm text-slate-500">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Inbox className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1 text-lg">No records found</h3>
        <p className="text-sm text-slate-500">There is currently no data available to display here.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className || ""}`}>
      <Table>
        <TableHeader className="bg-slate-50/80 border-b border-slate-200">
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="font-semibold text-slate-600 h-12 uppercase text-xs tracking-wider">
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead className="text-right font-semibold text-slate-600 h-12 uppercase text-xs tracking-wider">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow 
              key={row.id || row.loan_id || row.customer_id || i}
              className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
            >
              {columns.map((col) => (
                <TableCell key={`${row.id || row.loan_id || i}-${String(col.key)}`} className="py-4 text-sm font-medium text-slate-700">
                  {col.render ? col.render(row) : (row as any)[col.key] as React.ReactNode}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="text-right whitespace-nowrap py-4">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-primary hover:text-primary/80 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors mr-2 opacity-100 md:opacity-0 group-hover:opacity-100 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
