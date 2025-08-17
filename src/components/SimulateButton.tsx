import React, { useState } from 'react';
import { Play, Loader2, ShoppingCart, DollarSign } from 'lucide-react';
import { Transaction, Product } from '../types';

interface SimulateButtonProps {
  products: Product[];
  onTransactionUpdate: (newTransactions: Transaction[], updatedProducts: Product[]) => void;
}

const SimulateButton: React.FC<SimulateButtonProps> = ({ products, onTransactionUpdate }) => {
  const [isSimulating, setIsSimulating] = useState(false);

  /**
   * Option B: Bulk Simulation
   */
  const simulateTransactions = async () => {
    setIsSimulating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        'https://inventory-backend-zwni.onrender.com/api/transactions/simulate',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ count: Math.floor(Math.random() * 6) + 5 }),
        }
      );

      const data = await response.json();
      onTransactionUpdate(data.transactions, products); // backend doesn’t send updatedProducts yet
    } catch (error) {
      console.error('Failed to simulate transactions:', error);
    }
    setIsSimulating(false);
  };

  /**
   * Option C: Individual Transactions
   */
  const processPurchase = async (productId: string, quantity: number, unitPrice: number) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      'https://inventory-backend-zwni.onrender.com/api/transactions/purchase',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, unitPrice }),
      }
    );
    const data = await response.json();
    onTransactionUpdate([data], products);
  };

  const processSale = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      'https://inventory-backend-zwni.onrender.com/api/transactions/sale',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );
    const data = await response.json();
    onTransactionUpdate([data], products);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Simulation Options</h3>
        <p className="text-sm text-gray-600 mb-6">
          Choose how you want to simulate or process transactions
        </p>

        {/* Option B: Bulk Simulation */}
        <button
          onClick={simulateTransactions}
          disabled={isSimulating}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed mr-2"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Simulating Transactions...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Simulate Bulk Transactions
            </>
          )}
        </button>

        {/* Option C: Manual Transactions */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => processPurchase(products[0]?.id, 5, 20)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition duration-200 font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Purchase Sample
          </button>

          <button
            onClick={() => processSale(products[0]?.id, 3)}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition duration-200 font-medium"
          >
            <DollarSign className="w-4 h-4" />
            Sale Sample
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulateButton;
