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
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Load auth data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // 🟢 Login function
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.success && (data.access || data.token)) {
        // Prefer JWT keys: access + refresh
        const accessToken = data.access || data.token;
        const refreshToken = data.refresh || data.refresh_token;

        // 🟢 Construct user object from API
        const userObj = {
          first_name: data.user?.first_name || data.first_name || "",
          last_name: data.user?.last_name || data.last_name || "",
          username: data.user?.username || data.username || "",
          role: data.user?.role || data.role || "user",
          email: data.user?.email || email,
        };

        // Store in localStorage
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userObj));

        // Update state
        setToken(accessToken);
        setUser(userObj);
        setError(null);

        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return { success: true };
      } else {
        throw new Error(data.message || "Invalid login response");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
      return { success: false, message: err.message };
    }
  };

  // 🟢 Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

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

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </ErrorBoundary>
  );
};
