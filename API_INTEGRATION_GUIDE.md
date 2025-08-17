# Backend API Integration Points

This document outlines all the places where you'll need to integrate backend APIs to replace the current in-memory functionality.

## 1. Authentication (Login Component)

**File**: `src/components/Login.tsx`
**Location**: `handleSubmit` function (lines ~25-40)

```typescript
// REPLACE THIS SECTION:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple in-memory authentication
  if (userId === 'admin' && password === 'password') {
    onLogin(userId);
  } else {
    setError('Invalid credentials. Use admin/password');
  }
  
  setIsLoading(false);
};
```

**API Integration**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store JWT token
      localStorage.setItem('authToken', data.token);
      onLogin(userId);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Invalid credentials');
    }
  } catch (error) {
    setError('Network error. Please try again.');
  }
  
  setIsLoading(false);
};
```

## 2. Dashboard Data Loading

**File**: `src/components/Dashboard.tsx`
**Location**: `useEffect` hook for initial data (lines ~15-85)

```typescript
// REPLACE THIS SECTION:
useEffect(() => {
  const initialProducts: Product[] = [
    // ... hardcoded product data
  ];

  const initialTransactions: Transaction[] = [
    // ... hardcoded transaction data
  ];

  setProducts(initialProducts);
  setTransactions(initialTransactions);
}, []);
```

**API Integration**:
```typescript
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Load products
      const productsResponse = await fetch('/api/products', { headers });
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
```

## 3. Transaction Simulation (Real-time Updates)

**File**: `src/components/SimulateButton.tsx`
**Location**: `simulateTransactions` function (lines ~35-80)

**Current Implementation**: Generates random transactions in memory

**API Integration Options**:

### Option A: Real-time WebSocket Connection
```typescript
// Add to Dashboard component
useEffect(() => {
  const token = localStorage.getItem('authToken');
  const ws = new WebSocket(`ws://your-api/ws?token=${token}`);
  
  ws.onmessage = (event) => {
    const transaction = JSON.parse(event.data);
    // Update transactions and products state
    setTransactions(prev => [transaction, ...prev]);
    // Update product inventory based on transaction
  };

  return () => ws.close();
}, []);
```

### Option B: Replace Simulation with API Calls
```typescript
const simulateTransactions = async () => {
  setIsSimulating(true);
  
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/transactions/simulate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: Math.floor(Math.random() * 6) + 5 }),
    });

    const { transactions: newTransactions, updatedProducts } = await response.json();
    onTransactionUpdate(newTransactions, updatedProducts);
  } catch (error) {
    console.error('Failed to simulate transactions:', error);
  }
  
  setIsSimulating(false);
};
```

## 4. Individual Transaction Processing

**File**: `src/components/SimulateButton.tsx`
**Location**: Transaction generation and processing logic

**API Integration**: Replace in-memory FIFO calculations with API calls
```typescript
// For each transaction type:

// Purchase Transaction
const processPurchase = async (productId: string, quantity: number, unitPrice: number) => {
  const response = await fetch('/api/transactions/purchase', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity, unitPrice }),
  });
  return response.json();
};

// Sale Transaction
const processSale = async (productId: string, quantity: number) => {
  const response = await fetch('/api/transactions/sale', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return response.json();
};
```

## 5. Logout Functionality

**File**: `src/components/Dashboard.tsx`
**Location**: `onLogout` prop handler

**API Integration**:
```typescript
const handleLogout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('authToken');
    onLogout();
  }
};
```

## 6. Error Handling & Loading States

**Files**: All components
**Add**: Proper error handling for API failures

```typescript
// Add error state management
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

// Add error boundary component
// Add retry mechanisms
// Add offline state handling
```

## 7. Authentication Token Management

**Create**: `src/utils/auth.ts`
```typescript
export const getAuthToken = () => localStorage.getItem('authToken');

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
```

## 8. API Client Setup

**Create**: `src/utils/apiClient.ts`
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  get: (endpoint: string) => apiClient.request(endpoint),
  post: (endpoint: string, data: any) => 
    apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => 
    apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => 
    apiClient.request(endpoint, { method: 'DELETE' }),
};
```

## Required Backend API Endpoints

1. **Authentication**
   - `POST /api/auth/login` - User login
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth/verify` - Token verification

2. **Products**
   - `GET /api/products` - Get all products with current inventory
   - `GET /api/products/:id` - Get specific product details
   - `POST /api/products` - Create new product

3. **Transactions**
   - `GET /api/transactions` - Get transaction history
   - `POST /api/transactions/purchase` - Process purchase transaction
   - `POST /api/transactions/sale` - Process sale transaction (with FIFO)
   - `POST /api/transactions/simulate` - Simulate multiple transactions

4. **Real-time Updates**
   - WebSocket endpoint for live transaction updates
   - Server-sent events for inventory changes

## Environment Variables

Add to `.env`:
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

## Next Steps

1. Replace hardcoded data with API calls in the order listed above
2. Add proper error handling and loading states
3. Implement authentication token management
4. Set up WebSocket connection for real-time updates
5. Add offline support and retry mechanisms
6. Implement proper TypeScript types for API responses