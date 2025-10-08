import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

const GUEST_CART_KEY = 'guest_cart';

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_amount: 0, id: null });
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  // Check if user is authenticated
  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Initialize cart from localStorage or API
  useEffect(() => {
    const isAuthenticated = checkAuthStatus();
    setIsGuest(!isAuthenticated);
    
    if (isAuthenticated) {
      // User is authenticated - fetch cart from API
      fetchCart();
    } else {
      // User is guest - load cart from localStorage
      loadGuestCart();
    }
  }, []);

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    const guestCart = localStorage.getItem(GUEST_CART_KEY);
    if (guestCart) {
      try {
        const parsedCart = JSON.parse(guestCart);
        setCart(parsedCart);
        console.log('🛒 Loaded guest cart:', parsedCart);
      } catch (e) {
        console.error('Error parsing guest cart:', e);
        setCart({ items: [], total_amount: 0, id: null });
      }
    } else {
      setCart({ items: [], total_amount: 0, id: null });
    }
  };

  // Save guest cart to localStorage when it changes
  useEffect(() => {
    if (isGuest && cart) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isGuest]);

  // Listen for guest cart sync completion
  useEffect(() => {
    const handleGuestCartSynced = (event) => {
      console.log('🔄 Guest cart sync completed, refreshing cart...');
      setIsGuest(false);
      fetchCart(); // Refresh cart from server
    };

    window.addEventListener('guestCartSynced', handleGuestCartSynced);
    return () => window.removeEventListener('guestCartSynced', handleGuestCartSynced);
  }, []);

  // Fetch cart from API - memoized to prevent infinite loops
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsGuest(true);
        loadGuestCart();
        return;
      }
      
      const response = await axios.get('https://mycomatrix.in/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.status === 200) {
        // Transform API response to match expected structure
        const apiCart = response.data;
        const transformedCart = {
          id: apiCart.id,
          items: apiCart.items || [],
          total_amount: parseFloat(apiCart.total_amount || 0),
          status: apiCart.status,
          payment_status: apiCart.payment_status
        };
        
        setCart(transformedCart);
        setIsGuest(false);
        console.log('✅ Fetched cart from API:', transformedCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        // Token is invalid, switch to guest mode
        setIsGuest(true);
        loadGuestCart();
      }
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since we get fresh token from localStorage each time

  const addToCart = async (product, quantity = 1) => {
    console.log(`🛒 Adding to cart: ${product.name} (qty: ${quantity}), isGuest: ${isGuest}`);
    
    // If user is guest, update local cart
    if (isGuest) {
      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item.product.id === product.id);
        let newItems = [];
        
        if (existingItem) {
          // Update quantity if item exists
          newItems = prevCart.items.map(item => 
            item.product.id === product.id 
              ? { ...item, qty: item.qty + quantity }
              : item
          );
        } else {
          // Add new item with structure matching API
          newItems = [...prevCart.items, { 
            id: `guest_${product.id}_${Date.now()}`,
            product: product, 
            qty: quantity,
            price: parseFloat(product.price)
          }];
        }
        
        // Calculate new total
        const newTotal = newItems.reduce((sum, item) => 
          sum + (parseFloat(item.price || item.product.price) * item.qty), 0);
          
        const newCart = { 
          items: newItems, 
          total_amount: newTotal,
          id: null // guest cart doesn't have ID
        };
        
        console.log('💾 Updated guest cart:', newCart);
        return newCart;
      });
      return { success: true };
    }
    
    // If user is logged in, call the API
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'https://mycomatrix.in/api/cart/add/',
        {
          product_id: product.id,
          quantity: quantity
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.status === 200) {
        // Transform API response to match expected structure
        const apiCart = response.data;
        const transformedCart = {
          id: apiCart.id,
          items: apiCart.items || [],
          total_amount: parseFloat(apiCart.total_amount || 0),
          status: apiCart.status,
          payment_status: apiCart.payment_status
        };
        
        setCart(transformedCart);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    }
    return { success: false };
  };

  // Sync guest cart to database (called from AuthContext)
  const syncGuestCart = async () => {
    console.log('🔄 Starting guest cart sync from CartContext...');
    
    const guestCartData = localStorage.getItem(GUEST_CART_KEY);
    
    if (!guestCartData) {
      console.log('ℹ️ No guest cart found');
      return { success: true, message: 'No items to sync' };
    }
    
    try {
      const guestCart = JSON.parse(guestCartData);
      
      if (!guestCart.items || guestCart.items.length === 0) {
        console.log('ℹ️ Guest cart is empty');
        localStorage.removeItem(GUEST_CART_KEY);
        return { success: true, message: 'No items to sync' };
      }
      
      console.log(`📦 Found ${guestCart.items.length} items in guest cart`);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      // Prepare items for sync
      const itemsToSync = guestCart.items.map(item => ({
        product_id: item.product.id,
        quantity: item.qty || 1
      }));
      
      console.log('🚀 Syncing items to database:', itemsToSync);
      
      // Send sync request
      const response = await axios.post(
        'https://mycomatrix.in/api/cart/sync-guest-cart/',
        { items: itemsToSync },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        console.log('✅ Guest cart synced successfully');
        
        // Clear guest cart after successful sync
        localStorage.removeItem(GUEST_CART_KEY);
        
        // Update cart state with synced data
        const apiCart = response.data;
        const transformedCart = {
          id: apiCart.id,
          items: apiCart.items || [],
          total_amount: parseFloat(apiCart.total_amount || 0),
          status: apiCart.status,
          payment_status: apiCart.payment_status
        };
        
        setCart(transformedCart);
        setIsGuest(false);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('guestCartSynced', {
          detail: { success: true, itemCount: itemsToSync.length }
        }));
        
        return { 
          success: true, 
          message: `${itemsToSync.length} items transferred to your cart!`
        };
      }
    } catch (error) {
      console.error('❌ Failed to sync guest cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sync cart items'
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (isGuest) {
        // Handle guest cart removal
        setCart(prevCart => {
          const newItems = prevCart.items.filter(item => 
            item.product.id !== itemId && item.id !== itemId
          );
          const newTotal = newItems.reduce((sum, item) => 
            sum + (parseFloat(item.price || item.product.price) * item.qty), 0);
          
          return { ...prevCart, items: newItems, total_amount: newTotal };
        });
        return;
      }
      
      await axios.delete(`https://mycomatrix.in/api/cart/remove/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      // Refresh cart after removal
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (isGuest) {
        // Handle guest cart update
        setCart(prevCart => {
          const newItems = prevCart.items.map(item => 
            (item.product.id === itemId || item.id === itemId)
              ? { ...item, qty: newQuantity }
              : item
          );
          
          const newTotal = newItems.reduce((sum, item) => 
            sum + (parseFloat(item.price || item.product.price) * item.qty), 0);
          
          return { ...prevCart, items: newItems, total_amount: newTotal };
        });
        return;
      }
      
      await axios.post(
        `https://mycomatrix.in/api/cart/update/${itemId}/`,
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      // Refresh cart after update
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (isGuest) {
        setCart({ items: [], total_amount: 0, id: null });
        localStorage.removeItem(GUEST_CART_KEY);
        return;
      }
      
      await axios.post('https://mycomatrix.in/api/cart/clear/', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      setCart({ items: [], total_amount: 0, id: null });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Listen for authentication changes - optimized
  useEffect(() => {
    let checkInterval;
    
    const handleStorageChange = () => {
      const nowAuthenticated = checkAuthStatus();
      const wasGuest = isGuest;
      
      if (wasGuest && nowAuthenticated) {
        console.log('🔄 User logged in, waiting for cart sync...');
        setIsGuest(false);
      } else if (!nowAuthenticated && !wasGuest) {
        console.log('👋 User logged out, switching to guest cart');
        setIsGuest(true);
        loadGuestCart();
      }
    };
    
    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Reduced frequency check - only every 2 seconds instead of 1 second
    checkInterval = setInterval(() => {
      const nowAuthenticated = checkAuthStatus();
      if (isGuest === nowAuthenticated) { // Only update if there's an actual change
        handleStorageChange();
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isGuest]); // Only depend on isGuest

  // Utility functions - memoized to prevent infinite re-renders
  const getTotalItems = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.qty || 0), 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    if (!cart) return 0;
    return cart.total_amount || cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price || item.product.price) * (item.qty || 0)), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isGuest,
      isAuthenticated: !isGuest,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      syncGuestCart, // Add this for AuthContext to use
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};