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

  // 🟢 Load auth data from localStorage and validate token
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is still valid by making a simple API call
        await axios.get('https://mycomatrix.in/api/profile/', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        // Token is valid, set up auth state
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (error) {
        // Token is invalid, clear auth state
        console.error('Token validation failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  // 🟢 UPDATED Login function - Use /api/login/ endpoint
const login = async ({ email, password }) => {
  console.log('🔑 Starting login process...');
  
  try {
    // Clear old data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    delete axios.defaults.headers.common["Authorization"];

    // 🔥 Correct login API
    const response = await axios.post(
      "https://mycomatrix.in/api/login/",
      {
        email: email.trim(),
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("🔍 Login API data:", response.data);

    if (!response.data.success) {
      return { success: false, message: response.data.message };
    }

    // 💥 Correct user object from backend
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    const userData = response.data.user;

    if (!userData.role) {
      console.warn("⚠ User role missing in response!");
    }

    // SAVE → THIS was your missing part
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // UPDATE STATE
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);

    // Add token to axios
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    console.log("✅ Login success — role:", userData.role);

    return {
      success: true,
      message: response.data.message,
      user: userData,
    };
  } catch (error) {
    console.error("❌ Login Error:", error);
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Login failed";

    return { success: false, message: msg };
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
        product_id: item.product?.id,
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
    // Clear all auth-related data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    // Reset state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Clear axios headers
    delete axios.defaults.headers.common["Authorization"];
    
    // Navigate to login and force a full page reload to clear any cached data
    window.location.href = '/login';
  };

  // 🟢 Auto logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('🛑 401 Unauthorized - Auto logging out');
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