import { Navbar } from "@/components/ui"
import { AdminSidebar } from "@/components/ui/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto w-full p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
