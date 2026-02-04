import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { getBusinessStats } from '../../api/business';
import logo from '../../assets/logo.png';

function BusinessDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getBusinessStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <img src={logo} alt="Atome 3D" className="h-10" />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {user?.profile?.businessName}
          </h2>
          <p className="text-gray-600 mt-2">Dashboard entreprise</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(ROUTES.BUSINESS_SCANNER)}
            className="bg-primary-600 hover:bg-primary-700 text-white py-6 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-xl font-bold">Scanner QR Code</span>
          </button>

          <button
            onClick={() => navigate(ROUTES.BUSINESS_CUSTOMERS)}
            className="bg-green-600 hover:bg-green-700 text-white py-6 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xl font-bold">Voir Mes Clients</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Clients</h3>
            <div className="text-3xl font-bold text-primary-600">
              {loading ? '...' : stats?.totalCustomers || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total clients fidèles</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Bobines vendues</h3>
            <div className="text-3xl font-bold text-primary-600">
              {loading ? '...' : stats?.totalPurchases || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Récompenses</h3>
            <div className="text-3xl font-bold text-primary-600">
              {loading ? '...' : stats?.totalRewards || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">Bobines offertes</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Cliquez sur "Scanner QR Code Client"</li>
            <li>2. Autorisez l'accès à la caméra</li>
            <li>3. Scannez le QR code du client</li>
            <li>4. Ajoutez automatiquement 1 point par bobine</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">Récompenses automatiques :</p>
            <div className="flex gap-4">
              <span className="text-sm text-blue-800"><span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">7</span> = Accessoire offert</span>
              <span className="text-sm text-blue-800"><span className="bg-green-500 text-white px-2 py-1 rounded font-bold">15</span> = Bobine Bambu Lab</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;
