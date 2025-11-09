import React, { useState } from "react";
import { Customer } from "../types";
import { PlusIcon, PencilIcon, TrashIcon } from "./icons/Icons";
import Modal from "./Modal";

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, "id">) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    due_amount: "",
  });

  // === Modal controls ===
  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        due_amount: customer.due_amount?.toString() || "",
      });
      setEditingCustomer(customer);
    } else {
      setFormData({ name: "", phone: "", email: "", address: "", due_amount: "" });
      setEditingCustomer(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  // === Submit handler ===
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("⚠️ Customer name is required.");

    try {
      setSaving(true);
      if (editingCustomer) {
        onUpdateCustomer({
          ...editingCustomer,
          ...formData,
          due_amount: Number(formData.due_amount),
        });
        alert("✅ Customer updated successfully!");
      } else {
        onAddCustomer({
          ...formData,
          due_amount: Number(formData.due_amount),
        });
        alert("✅ Customer added successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      onDeleteCustomer(id);
      alert("🗑️ Customer deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete customer.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="mr-2" />
          Add Customer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Due (৳)</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b dark:border-gray-700">
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.address}</td>
                  <td className="p-4">{Number(customer.due_amount).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(customer)}
                        className="p-2 text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          title={editingCustomer ? "Edit Customer" : "Add Customer"}
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Amount (৳)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.due_amount}
                onChange={(e) =>
                  setFormData({ ...formData, due_amount: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving
                  ? "Saving..."
                  : editingCustomer
                  ? "Update Customer"
                  : "Save Customer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CustomersView;
