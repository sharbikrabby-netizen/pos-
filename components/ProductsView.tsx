import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/Icons';
import Modal from './Modal';
import ProductForm from './ProductForm';
import { CURRENCY_SYMBOL } from '../constants';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(false);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    try {
      setSaving(true);
      if ('id' in productData) {
        onUpdateProduct(productData);
        alert("✅ Product updated successfully!");
      } else {
        onAddProduct(productData);
        alert("✅ Product added successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      onDeleteProduct(productId);
      alert("🗑️ Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete product.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700">
                <td className="p-4">{product.name}</td>
                <td className="p-4">
                  {CURRENCY_SYMBOL}
                  {Number(product.price).toFixed(2)}
                </td>
                <td className="p-4">{Number(product.stock)} kg</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No products found.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          title={editingProduct ? "Edit Product" : "Add Product"}
        >
          <ProductForm
            onSave={handleSaveProduct}
            product={editingProduct}
          />
          {saving && (
            <p className="text-blue-500 mt-3 text-center animate-pulse">
              Saving...
            </p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ProductsView;
