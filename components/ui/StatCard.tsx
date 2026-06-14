import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
  trend?: { value: number; isUp: boolean }
}

export function StatCard({ title, value, description, icon, className, trend }: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white/90 backdrop-blur-xl rounded-2xl", 
      className
    )}>
      {/* Subtle top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <CardHeader className="flex flex-row items-start justify-between pb-2 pt-6 px-6">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold text-slate-500 tracking-wide uppercase">{title}</CardTitle>
        </div>
        {icon && (
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-700 shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110 duration-300">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        
        {description && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center">
            <p className="text-sm text-slate-500 font-medium">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
