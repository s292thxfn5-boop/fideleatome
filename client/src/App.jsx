import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';

// Routes protégées
import ProtectedRoute from './routes/ProtectedRoute';
import CustomerRoute from './routes/CustomerRoute';
import BusinessRoute from './routes/BusinessRoute';

// Pages d'authentification
import Login from './pages/Auth/Login';
import RegisterChoice from './pages/Auth/RegisterChoice';
import RegisterCustomer from './pages/Auth/RegisterCustomer';
import RegisterBusiness from './pages/Auth/RegisterBusiness';

// Pages client
import CustomerDashboard from './pages/Customer/Dashboard';
import CustomerQRCode from './pages/Customer/MyQRCode';
import CustomerProgress from './pages/Customer/Progress';
import CustomerHistory from './pages/Customer/History';

// Pages entreprise
import BusinessDashboard from './pages/Business/Dashboard';
import BusinessScanner from './pages/Business/Scanner';
import BusinessCustomers from './pages/Business/Customers';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER_CHOICE} element={<RegisterChoice />} />
          <Route path={ROUTES.REGISTER_CUSTOMER} element={<RegisterCustomer />} />
          <Route path={ROUTES.REGISTER_BUSINESS} element={<RegisterBusiness />} />

          {/* Routes client */}
          <Route
            path={ROUTES.CUSTOMER_DASHBOARD}
            element={
              <CustomerRoute>
                <CustomerDashboard />
              </CustomerRoute>
            }
          />
          <Route
            path={ROUTES.CUSTOMER_QRCODE}
            element={
              <CustomerRoute>
                <CustomerQRCode />
              </CustomerRoute>
            }
          />
          <Route
            path={ROUTES.CUSTOMER_PROGRESS}
            element={
              <CustomerRoute>
                <CustomerProgress />
              </CustomerRoute>
            }
          />
          <Route
            path={ROUTES.CUSTOMER_HISTORY}
            element={
              <CustomerRoute>
                <CustomerHistory />
              </CustomerRoute>
            }
          />

          {/* Routes entreprise */}
          <Route
            path={ROUTES.BUSINESS_DASHBOARD}
            element={
              <BusinessRoute>
                <BusinessDashboard />
              </BusinessRoute>
            }
          />
          <Route
            path={ROUTES.BUSINESS_SCANNER}
            element={
              <BusinessRoute>
                <BusinessScanner />
              </BusinessRoute>
            }
          />
          <Route
            path={ROUTES.BUSINESS_CUSTOMERS}
            element={
              <BusinessRoute>
                <BusinessCustomers />
              </BusinessRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
