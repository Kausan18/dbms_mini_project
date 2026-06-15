"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomersPage() {
  const ADMIN_ID = "PASTE_ADMIN_UUID_HERE";

  const [customers, setCustomers] = useState<any[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const loadCustomers = async () => {
    const res = await fetch("/api/admin/customers");
    const data = await res.json();
    setCustomers(data.data || []);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/admin/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        admin_id: ADMIN_ID,
      }),
    });

    setOpenCreate(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    loadCustomers();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) return;

    await fetch(
      `/api/admin/customers/${selectedCustomer.customer_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          admin_id: ADMIN_ID,
        }),
      }
    );

    setOpenEdit(false);
    setSelectedCustomer(null);

    loadCustomers();
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    await fetch(
      `/api/admin/customers/${selectedCustomer.customer_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: ADMIN_ID,
        }),
      }
    );

    setOpenDelete(false);
    setSelectedCustomer(null);

    loadCustomers();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Customer Management
        </h1>

        <Button onClick={() => setOpenCreate(true)}>
          Add Customer
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customer_id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedCustomer(customer);

                    setFormData({
                      name: customer.name || "",
                      email: customer.email || "",
                      phone: customer.phone || "",
                      address: customer.address || "",
                    });

                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setOpenDelete(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FormDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        title="Add Customer"
        onSubmit={handleCreate}
        submitLabel="Create Customer"
      >
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
          />
        </div>
      </FormDialog>

      <FormDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        title="Edit Customer"
        onSubmit={handleEdit}
        submitLabel="Update Customer"
      >
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
          />
        </div>
      </FormDialog>

      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete ${
          selectedCustomer?.name || "this customer"
        }?`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}