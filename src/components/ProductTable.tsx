import React from 'react';
import { Package } from 'lucide-react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Product Stock Overview</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Inventory Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Cost per Unit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50 transition-colors duration-150">
  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    {product.productId}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
    {product.productName || "N/A"}
  </td>
  <td className="px-6 py-4 whitespace-nowrap">
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        product.currentQuantity > 0
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {product.currentQuantity} units
    </span>
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    {formatCurrency(product.totalInventoryCost)}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
    {formatCurrency(product.averageCostPerUnit)}
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;