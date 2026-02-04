import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const points = user?.profile?.points || 0;
  const totalPurchases = user?.profile?.totalPurchases || 0;
  const totalRewards = Math.floor(totalPurchases / 15);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary-600">FideleAtome</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.profile?.firstName} !
          </h2>
          <p className="text-gray-600 mt-2">Bienvenue sur votre carte de fidélité digitale</p>
        </div>

        {/* Résumé rapide */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Points actuels</p>
            <p className="text-3xl font-bold text-primary-600">{points}/15</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total achats</p>
            <p className="text-3xl font-bold text-gray-800">{totalPurchases}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Récompenses</p>
            <p className="text-3xl font-bold text-primary-600">{totalRewards}</p>
          </div>
        </div>

        {/* Navigation principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bouton QR Code */}
          <button
            onClick={() => navigate(ROUTES.CUSTOMER_QRCODE)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary-100 p-3 rounded-full group-hover:bg-primary-200 transition-colors">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Mon QR Code</h3>
            <p className="text-gray-600 text-sm">
              Scanner lors de vos achats
            </p>
          </button>

          {/* Bouton Progression */}
          <button
            onClick={() => navigate(ROUTES.CUSTOMER_PROGRESS)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Ma Progression</h3>
            <p className="text-gray-600 text-sm">
              Points et récompenses
            </p>
          </button>

          {/* Bouton Historique */}
          <button
            onClick={() => navigate(ROUTES.CUSTOMER_HISTORY)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Mon Historique</h3>
            <p className="text-gray-600 text-sm">
              Achats et récompenses
            </p>
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Présentez votre QR code à chaque achat</li>
            <li>• Gagnez 1 point par bobine achetée</li>
            <li>• La 15ème bobine est offerte !</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
