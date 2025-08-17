import React, { useState, useEffect } from 'react';
import { LogOut, BarChart3 } from 'lucide-react';
import { Product, Transaction, InventoryBatch } from '../types';
import ProductTable from './ProductTable';
import TransactionLedger from './TransactionLedger';
import SimulateButton from './SimulateButton';

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize sample data
  useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Load products
      const productsResponse = await fetch('https://inventory-backend-zwni.onrender.com/api/products', { headers });
      const productsData = await productsResponse.json();
      setProducts(productsData);

      // Load transactions
      const transactionsResponse = await fetch('/api/transactions', { headers });
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Handle error (show notification, redirect to login, etc.)
    }
  };

  loadDashboardData();
}, []);

  const handleTransactionUpdate = (newTransactions: Transaction[], updatedProducts: Product[]) => {
    setTransactions(prev => [...prev, ...newTransactions]);
    setProducts(updatedProducts);
  };

  const totalInventoryValue = products.reduce((sum, product) => sum + product.totalInventoryCost, 0);
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, product) => sum + product.currentQuantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Inventory Management System</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {userId}</span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalInventoryValue)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units in Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-8">
          <ProductTable products={products} />
        </div>

        {/* Bottom Section - Transaction Ledger and Simulate Button */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionLedger transactions={transactions} />
          </div>
          <div>
            <SimulateButton 
              products={products} 
              onTransactionUpdate={handleTransactionUpdate} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;