import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Auth Context & Protected Route
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

// Reusable Components & Layouts
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CustomerLayout from './layouts/CustomerLayout'
import ShopOwnerLayout from './layouts/ShopOwnerLayout'
import SuperAdminLayout from './layouts/SuperAdminLayout'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import DroneMarketplace from './pages/DroneMarketplace'
import DroneDetails from './pages/DroneDetails'
import BookingPage from './pages/BookingPage'
import NotFound from './pages/NotFound'

// Authentication Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import AccessDeniedPage from './pages/auth/AccessDeniedPage'

// Customer Dashboard Pages
import CustomerOverview from './pages/customer/CustomerOverview'
import CustomerRentals from './pages/customer/CustomerRentals'
import CustomerTracking from './pages/customer/CustomerTracking'
import CustomerAnalytics from './pages/customer/CustomerAnalytics'
import CustomerReports from './pages/customer/CustomerReports'
import CustomerWishlist from './pages/customer/CustomerWishlist'
import CustomerDocuments from './pages/customer/CustomerDocuments'
import CustomerPayments from './pages/customer/CustomerPayments'
import CustomerNotifications from './pages/customer/CustomerNotifications'
import CustomerProfile from './pages/customer/CustomerProfile'
import CustomerSettings from './pages/customer/CustomerSettings'

// Shop Owner Dashboard Pages
import ShopOwnerCustomers from './pages/owner/ShopOwnerCustomers'
import ShopOwnerTracking from './pages/owner/ShopOwnerTracking'
import OwnerReports from './pages/owner/OwnerReports'
import ShopOwnerDocuments from './pages/owner/ShopOwnerDocuments'
import ShopOwnerPayments from './pages/owner/ShopOwnerPayments'
import ShopOwnerReviews from './pages/owner/ShopOwnerReviews'
import OwnerNotifications from './pages/owner/OwnerNotifications'
import ShopOwnerProfile from './pages/owner/ShopOwnerProfile'
import ShopOwnerSettings from './pages/owner/ShopOwnerSettings'

// Super Admin Dashboard Pages
import SuperAdminShops from './pages/admin/SuperAdminShops'
import SuperAdminShopOwners from './pages/admin/SuperAdminShopOwners'
import SuperAdminTracking from './pages/admin/SuperAdminTracking'
import AdminReports from './pages/admin/AdminReports'
import SuperAdminDocuments from './pages/admin/SuperAdminDocuments'
import SuperAdminPayments from './pages/admin/SuperAdminPayments'
import SuperAdminReviews from './pages/admin/SuperAdminReviews'
import SuperAdminComplaints from './pages/admin/SuperAdminComplaints'
import SuperAdminNotifications from './pages/admin/SuperAdminNotifications'
import SuperAdminProfile from './pages/admin/SuperAdminProfile'
import SuperAdminSettings from './pages/admin/SuperAdminSettings'

// Shared management pages (admin sees everything, shop owners see their own fleet)
import ManageOverview from './pages/manage/ManageOverview'
import RentalRequests from './pages/manage/RentalRequests'
import Orders from './pages/manage/Orders'
import Catalogue from './pages/manage/Catalogue'
import ManageAnalytics from './pages/manage/ManageAnalytics'
import Customers from './pages/manage/Customers'

// Layout wrapper component to conditionally hide public Navbar & Footer inside dashboard routes
function AppLayout() {
  const location = useLocation()
  const isDashboardRoute = location.pathname.startsWith('/user/') || location.pathname.startsWith('/admin/') || location.pathname.startsWith('/owner/') || location.pathname.startsWith('/customer/')

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col">
      
      {/* Top Public Navigation (Hidden on Dashboard routes) */}
      {!isDashboardRoute && <Navbar />}

      {/* Dynamic Route Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/drones" element={<DroneMarketplace />} />
          <Route path="/drones/:id" element={<DroneDetails />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Authentication Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {/* Direct Role Route Shortcuts */}
          <Route path="/customer/tracking" element={<Navigate to="/user/tracking" replace />} />
          <Route path="/customer/analytics" element={<Navigate to="/user/analytics" replace />} />
          <Route path="/customer/reports" element={<Navigate to="/user/reports" replace />} />

          {/* Protected Customer Dashboard Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerLayout>
                  <Routes>
                    <Route path="dashboard" element={<CustomerOverview />} />
                    <Route path="rentals" element={<CustomerRentals />} />
                    <Route path="bookings" element={<Navigate to="/user/rentals" replace />} />
                    <Route path="tracking" element={<CustomerTracking />} />
                    <Route path="analytics" element={<CustomerAnalytics />} />
                    <Route path="reports" element={<CustomerReports />} />
                    <Route path="wishlist" element={<CustomerWishlist />} />
                    <Route path="documents" element={<CustomerDocuments />} />
                    <Route path="payments" element={<CustomerPayments />} />
                    <Route path="notifications" element={<CustomerNotifications />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="settings" element={<CustomerSettings />} />
                    <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                  </Routes>
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Shop Owner Dashboard Routes */}
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['shop-owner']}>
                <ShopOwnerLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManageOverview basePath="/owner" />} />
                    <Route path="requests" element={<RentalRequests />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="catalogue" element={<Catalogue />} />
                    <Route path="profile" element={<Navigate to="/owner/shop-profile" replace />} />
                    <Route path="drones" element={<Navigate to="/owner/catalogue" replace />} />
                    <Route path="bookings" element={<Navigate to="/owner/requests" replace />} />
                    <Route path="rentals" element={<Navigate to="/owner/orders" replace />} />
                    <Route path="customers" element={<ShopOwnerCustomers />} />
                    <Route path="tracking" element={<ShopOwnerTracking />} />
                    <Route path="analytics" element={<ManageAnalytics />} />
                    <Route path="reports" element={<OwnerReports />} />
                    <Route path="documents" element={<ShopOwnerDocuments />} />
                    <Route path="payments" element={<ShopOwnerPayments />} />
                    <Route path="reviews" element={<ShopOwnerReviews />} />
                    <Route path="notifications" element={<OwnerNotifications />} />
                    <Route path="shop-profile" element={<ShopOwnerProfile />} />
                    <Route path="settings" element={<ShopOwnerSettings />} />
                    <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
                  </Routes>
                </ShopOwnerLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Super Admin Dashboard Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <SuperAdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManageOverview basePath="/admin" />} />
                    <Route path="requests" element={<RentalRequests />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="catalogue" element={<Catalogue />} />
                    <Route path="shops" element={<SuperAdminShops />} />
                    <Route path="shop-owners" element={<SuperAdminShopOwners />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="drones" element={<Navigate to="/admin/catalogue" replace />} />
                    <Route path="bookings" element={<Navigate to="/admin/requests" replace />} />
                    <Route path="rentals" element={<Navigate to="/admin/orders" replace />} />
                    <Route path="tracking" element={<SuperAdminTracking />} />
                    <Route path="analytics" element={<ManageAnalytics />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="documents" element={<SuperAdminDocuments />} />
                    <Route path="payments" element={<SuperAdminPayments />} />
                    <Route path="reviews" element={<SuperAdminReviews />} />
                    <Route path="complaints" element={<SuperAdminComplaints />} />
                    <Route path="notifications" element={<SuperAdminNotifications />} />
                    <Route path="profile" element={<SuperAdminProfile />} />
                    <Route path="settings" element={<SuperAdminSettings />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </SuperAdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Public Site Footer (Hidden on Dashboard routes) */}
      {!isDashboardRoute && <Footer />}

    </div>
  )
}

// Main App Shell
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
