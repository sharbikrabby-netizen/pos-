import React, { useState } from "react";
import { Supplier } from "../types";
import { PlusIcon, PencilIcon, TrashIcon } from "./icons/Icons";
import Modal from "./Modal";

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, "id">) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
}

const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payable_amount: "",
  });

  // === Modal Control ===
  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        payable_amount: supplier.payable_amount?.toString() || "",
      });
      setEditingSupplier(supplier);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        payable_amount: "",
      });
      setEditingSupplier(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  // === Save Supplier ===
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("⚠️ Supplier name is required.");

    try {
      setSaving(true);
      if (editingSupplier) {
        onUpdateSupplier({
          ...editingSupplier,
          ...formData,
          payable_amount: Number(formData.payable_amount),
        });
        alert("✅ Supplier updated successfully!");
      } else {
        onAddSupplier({
          ...formData,
          payable_amount: Number(formData.payable_amount),
        });
        alert("✅ Supplier added successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save supplier.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      onDeleteSupplier(id);
      alert("🗑️ Supplier deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete supplier.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="mr-2" />
          Add Supplier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Payable (৳)</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b dark:border-gray-700">
                  <td className="p-4">{supplier.name}</td>
                  <td className="p-4">{supplier.email}</td>
                  <td className="p-4">{supplier.phone}</td>
                  <td className="p-4">{supplier.address}</td>
                  <td className="p-4">{Number(supplier.payable_amount).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(supplier)}
                        className="p-2 text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
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
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        >
          <form onSubmit={handleSaveSupplier} className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
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
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payable Amount (৳)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.payable_amount}
                onChange={(e) =>
                  setFormData({ ...formData, payable_amount: e.target.value })
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
                  : editingSupplier
                  ? "Update Supplier"
                  : "Save Supplier"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersView;
