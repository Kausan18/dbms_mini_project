"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui";
import { Users, UserPlus, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Customer = {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
};

export default function CustomersPage() {
  const getAdminId = () => localStorage.getItem("bms_profile_id") || "";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCustomers = async () => {
    const res = await fetch("/api/admin/customers");
    const data = await res.json();
    setCustomers(data.data || []);
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, admin_id: getAdminId() }),
    });
    const d = await res.json();
    if (!d.success) { showToast(d.error || "Failed to create customer", false); return; }
    showToast("Customer created successfully!", true);
    setOpenCreate(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
    loadCustomers();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const res = await fetch(`/api/admin/customers/${selectedCustomer.customer_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, admin_id: getAdminId() }),
    });
    const d = await res.json();
    if (!d.success) { showToast(d.error || "Failed to update customer", false); return; }
    showToast("Customer updated!", true);
    setOpenEdit(false);
    setSelectedCustomer(null);
    loadCustomers();
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    const res = await fetch(`/api/admin/customers/${selectedCustomer.customer_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: getAdminId() }),
    });
    const d = await res.json();
    if (!d.success) { showToast(d.error || "Failed to delete customer", false); return; }
    showToast("Customer deleted.", true);
    setOpenDelete(false);
    setSelectedCustomer(null);
    loadCustomers();
  };

  const fieldChange = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
            <Users className="w-3.5 h-3.5" /> Customer Management
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Customers</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg"
        >
          <UserPlus className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50">
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs py-4 px-6">Name</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Email</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Phone</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Address</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Joined</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-semibold">
                  No customers yet. Add your first customer.
                </TableCell>
              </TableRow>
            ) : customers.map((c) => (
              <TableRow key={c.customer_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <TableCell className="font-semibold text-slate-800 py-4 px-6">{c.name}</TableCell>
                <TableCell className="text-slate-600">{c.email}</TableCell>
                <TableCell className="text-slate-600">{c.phone}</TableCell>
                <TableCell className="text-slate-400 text-sm">{c.address || "—"}</TableCell>
                <TableCell className="text-slate-400 text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setFormData({ name: c.name, email: c.email, phone: c.phone, address: c.address || "" });
                        setOpenEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { setSelectedCustomer(c); setOpenDelete(true); }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <FormDialog open={openCreate} onOpenChange={setOpenCreate} title="Add New Customer" onSubmit={handleCreate} submitLabel="Create Customer">
        <div className="space-y-3">
          <Input placeholder="Full Name *" value={formData.name} onChange={fieldChange("name")} required />
          <Input placeholder="Email Address *" type="email" value={formData.email} onChange={fieldChange("email")} required />
          <Input placeholder="Phone Number *" value={formData.phone} onChange={fieldChange("phone")} required />
          <Input placeholder="Address (optional)" value={formData.address} onChange={fieldChange("address")} />
        </div>
      </FormDialog>

      {/* Edit dialog */}
      <FormDialog open={openEdit} onOpenChange={setOpenEdit} title="Edit Customer" onSubmit={handleEdit} submitLabel="Save Changes">
        <div className="space-y-3">
          <Input placeholder="Full Name" value={formData.name} onChange={fieldChange("name")} />
          <Input placeholder="Email Address" type="email" value={formData.email} onChange={fieldChange("email")} />
          <Input placeholder="Phone Number" value={formData.phone} onChange={fieldChange("phone")} />
          <Input placeholder="Address" value={formData.address} onChange={fieldChange("address")} />
        </div>
      </FormDialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Customer"
        description={`Are you sure you want to permanently delete ${selectedCustomer?.name || "this customer"}? This cannot be undone and will also remove their accounts and records.`}
        onConfirm={handleDelete}
        confirmLabel="Yes, Delete"
        variant="destructive"
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-semibold text-white animate-in slide-in-from-bottom-2 ${toast.ok ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
