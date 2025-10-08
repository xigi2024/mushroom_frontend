import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Component,
} from "react";
import axios from "axios";

// 🔴 Error Boundary for Authentication
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          <h3>Something went wrong with authentication.</h3>
          <p>Please refresh the page or try again later.</p>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 🔑 Create Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('access_token');
  });

  // 🟢 Load auth data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // 🟢 Login function with simplified cart sync
  const login = async ({ email, password }) => {
    console.log('🔑 Attempting login with:', { email });
    try {
      // Clear any existing tokens and data before login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      // Reset axios headers
      delete axios.defaults.headers.common["Authorization"];
      
      const response = await axios.post(
        "https://mycomatrix.in/api/login/",
        { 
          email: email.trim(), 
          password: password 
        },
        { 
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        }
      );

      console.log('🔑 Login response status:', response.status);
      console.log('🔑 Login response data:', response.data);
      
      const data = response.data;
      
      // Handle successful login (200 OK with access token)
      if (response.status === 200 && data.access) {
        const accessToken = data.access;
        const refreshToken = data.refresh;
        const userData = data.user || {};
        
        // Store tokens and user data
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update state and set axios header
        setToken(accessToken);
        setUser(userData);
        setError(null);
        setIsAuthenticated(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        console.log('✅ Login successful for user:', userData.email);
        
        // 🛒 SYNC GUEST CART TO DATABASE
        const syncResult = await syncGuestCartToDatabase(accessToken);
        
        return { 
          success: true,
          message: data.message || 'Login successful!',
          user: userData,
          cartSync: syncResult
        };
      } 
      
      // Handle error cases
      let errorMessage = data.message || 'Login failed. Please try again.';
      if (response.status === 401) {
        errorMessage = data.message || 'Invalid email or password';
      }
      
      console.error('❌ Login failed:', errorMessage);
      return {
        success: false,
        message: errorMessage,
        status: response.status,
        data: data
      };
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login';
      console.error("❌ Login error:", errorMessage, err);
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        error: err
      };
    }
  };

  // 🛒 Sync guest cart to database after login
  const syncGuestCartToDatabase = async (accessToken) => {
    console.log('🔄 Starting guest cart sync...');
    
    const GUEST_CART_KEY = 'guest_cart';
    const guestCartData = localStorage.getItem(GUEST_CART_KEY);
    
    if (!guestCartData) {
      console.log('ℹ️ No guest cart found');
      return { success: true, message: 'No items to sync' };
    }
    
    try {
      const guestCart = JSON.parse(guestCartData);
      
      if (!guestCart.items || guestCart.items.length === 0) {
        console.log('ℹ️ Guest cart is empty');
        localStorage.removeItem(GUEST_CART_KEY); // Clean up empty cart
        return { success: true, message: 'No items to sync' };
      }
      
      console.log(`📦 Found ${guestCart.items.length} items in guest cart:`, guestCart.items);
      
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
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        console.log('✅ Guest cart synced successfully');
        // Clear guest cart after successful sync
        localStorage.removeItem(GUEST_CART_KEY);
        
        // Dispatch custom event to notify CartContext
        window.dispatchEvent(new CustomEvent('guestCartSynced', {
          detail: { success: true, itemCount: itemsToSync.length }
        }));
        
        return {
          success: true,
          message: `${itemsToSync.length} items transferred to your cart!`,
          itemCount: itemsToSync.length
        };
      }
    } catch (error) {
      console.error('❌ Failed to sync guest cart:', error);
      // Don't remove guest cart if sync failed
      return {
        success: false,
        error: error.message || 'Failed to sync cart items'
      };
    }
  };

  // 🟢 Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("guest_cart"); // Also clear guest cart on logout

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    delete axios.defaults.headers.common["Authorization"];

    window.location.href = "/login";
  };

  // 🟢 Auto logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Update isAuthenticated whenever user or token changes
  useEffect(() => {
    const isAuth = !!(token && user);
    if (isAuth !== isAuthenticated) {
      setIsAuthenticated(isAuth);
    }
  }, [user, token, isAuthenticated]);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </ErrorBoundary>
  );
};