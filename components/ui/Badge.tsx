import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80",
        outline: "text-foreground",
        pending: "border-amber-200 bg-amber-50 text-amber-700 border shadow-sm dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
        approved: "border-emerald-200 bg-emerald-50 text-emerald-700 border shadow-sm dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
        rejected: "border-rose-200 bg-rose-50 text-rose-700 border shadow-sm dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
        active: "border-teal-200 bg-teal-50 text-teal-700 border shadow-sm dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800",
        inactive: "border-slate-200 bg-slate-100 text-slate-600 border shadow-sm dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
