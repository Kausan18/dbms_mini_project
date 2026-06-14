import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  containerClassName?: string
}

export const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", containerClassName)}>
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin text-primary", className)}
          {...props}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="mt-4 text-sm font-semibold tracking-tight text-slate-500 animate-pulse">Loading data...</span>
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"
