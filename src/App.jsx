import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/pages/Home'
import Header from './components/Header'   
import Footer from './components/Footer'   
import Register from './components/pages/Register'
import Contact from './components/pages/Contact'  
import ShippingPolicy from './components/pages/ShippingPolicy'
import RefundPolicy from './components/pages/RefundPolicy'
import PrivacyPolicy from './components/pages/PrivacyPolicy'
import TermsConditions from './components/pages/TermsConditions'  
import About from './components/pages/About us'
import Products from './components/pages/Products'
import ViewProduct from './components/pages/ViewProduct'
import ProductDetail from './components/pages/ProductDetail'
import ScrollToTop from './components/ScrollToTop'
import Login from './components/pages/Login'
import ForgotPassword from './components/pages/ForgotPassword'
import ResetPassword from './components/pages/ResetPassword'
import Checkout from './components/pages/Checkout'
import Cart from './components/pages/Cart'
import AdminDashboard from './components/pages/AdminDashboard'
import UserDashboard from './components/pages/UserDashboard'
import IoTMonitoring from './components/pages/IoTMonitoring'
import ProductOrder from './components/pages/ProductOrder'
import AdminProductOrder from './components/pages/AdminProductOrder'
import Accounts from './components/pages/Accounts'
import Settings from './components/pages/Settings'
import PaymentHistory from './components/pages/PaymentHistory'
import Profile from './components/pages/Profile'
import UserPayments from './components/pages/UserPayments'
import RoomDetail from './components/pages/RoomDetail'
import AddRoom from './components/pages/AddRoom'

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import WhatsAppButton from './components/WhatsAppButton';

function AppContent() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';
  const isLoginPage = location.pathname === '/login';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const isResetPasswordPage = location.pathname.startsWith('/reset-password');
  const isCheckoutPage = location.pathname === '/checkout';
  const isAdminDashboardPage = location.pathname === '/admin-dashboard';
  const isUserDashboardPage = location.pathname === '/user-dashboard';
  const isIoTMonitoringPage = location.pathname === '/admin/iot-monitoring' || location.pathname === '/user/iot-monitoring' || location.pathname.startsWith('/room/');
  const isProductOrderPage = location.pathname === '/admin/product-order' || location.pathname === '/user/product-order';
  const isAccountsPage = location.pathname === '/accounts';
  const isSettingsPage = location.pathname === '/settings';
  const isPaymentHistoryPage = location.pathname === '/payment-history';
  const isProfilePage = location.pathname === '/profile';
  const isUserPaymentsPage = location.pathname === '/user-payments';
  const isRoomDetailPage = location.pathname.startsWith('/room/') && !location.pathname.startsWith('/room/add');
  const isAddRoomPage = location.pathname === '/add-room' || location.pathname === '/room/add';
  const isProductDetailPage = location.pathname.startsWith('/products/') || location.pathname.startsWith('/product/');

  // Show header on all pages, hide footer only on specific pages
  const hideFooter = isRegisterPage || isLoginPage || isForgotPasswordPage || isResetPasswordPage || isCheckoutPage || isAdminDashboardPage || isUserDashboardPage || isIoTMonitoringPage || isProductOrderPage || isAccountsPage || isSettingsPage || isPaymentHistoryPage || isProfilePage || isUserPaymentsPage || isRoomDetailPage || isAddRoomPage ;
  const hideHeader = isAdminDashboardPage || isUserDashboardPage || isIoTMonitoringPage || isProductOrderPage || isAccountsPage || isSettingsPage || isPaymentHistoryPage || isProfilePage || isUserPaymentsPage || isRoomDetailPage || isAddRoomPage ;
  
  // Always show sidebar on all pages
  const showSidebar = true;

  return (
    <div>
      {!hideHeader && <Header />}
      <WhatsAppButton />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ViewProduct />} />
        <Route path="/product/:id/:subId" element={<ProductDetail />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <Layout activeSection="dashboard" setActiveSection={() => {}} userRole="admin">
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute>
              <Layout activeSection="dashboard" setActiveSection={() => {}} userRole="user">
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/iot-monitoring" 
          element={
            <ProtectedRoute>
              <Layout activeSection="iot-monitoring" setActiveSection={() => {}} userRole="admin">
                <IoTMonitoring userRole="admin" />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/iot-monitoring" 
          element={
            <ProtectedRoute>
              <Layout activeSection="iot-monitoring" setActiveSection={() => {}} userRole="user">
                <IoTMonitoring userRole="user" />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/room/:roomId" 
          element={
            <ProtectedRoute>
              <Layout activeSection="iot-monitoring" setActiveSection={() => {}} userRole="user">
                <RoomDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/product-order" 
          element={
            <ProtectedRoute>
              <Layout activeSection="products" setActiveSection={() => {}} userRole="admin">
                <AdminProductOrder userRole="admin" />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/product-order" 
          element={
            <ProtectedRoute>
              <Layout activeSection="products" setActiveSection={() => {}} userRole="user">
                <ProductOrder userRole="user" />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounts" 
          element={
            <ProtectedRoute>
              <Layout activeSection="accounts" setActiveSection={() => {}} userRole="admin">
                <Accounts />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout activeSection="settings" setActiveSection={() => {}} userRole="user">
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment-history" 
          element={
            <ProtectedRoute>
              <Layout activeSection="payment" setActiveSection={() => {}} userRole="user">
                <PaymentHistory />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout activeSection="profile" setActiveSection={() => {}} userRole="user">
                <div className="dashboard-content">
                  <Profile />
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-payments" 
          element={
            <ProtectedRoute>
              <Layout activeSection="payment" setActiveSection={() => {}} userRole="user">
                <UserPayments />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-room" 
          element={
            <ProtectedRoute>
              <Layout activeSection="iot-monitoring" setActiveSection={() => {}} userRole="user">
                <AddRoom />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </Router>
    </AuthProvider>
  )
}

export default App;