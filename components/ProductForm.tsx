import React, { useState } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSave, product }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("⚠️ Please enter a product name.");
      return;
    }

    const productData = product
      ? { ...product, name, price: Number(price), stock: Number(stock) }
      : { name, price: Number(price), stock: Number(stock) };

    try {
      setSaving(true);
      onSave(productData);
      if (!product) {
        // clear form only for new product
        setName('');
        setPrice('');
        setStock('');
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium mb-1">
          Stock (kg)
        </label>
        <input
          id="stock"
          type="number"
          min="0"
          placeholder="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : product ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
