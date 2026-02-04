import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, REWARD_TIERS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function CustomerDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const points = user?.profile?.points || 0;
  const totalPurchases = user?.profile?.totalPurchases || 0;
  const totalRewards = user?.profile?.totalRewards || 0;

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
            <p className="text-3xl font-bold text-primary-600">{points}</p>
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

        {/* Comment ça marche avec illustration */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-xl text-blue-900 mb-4 text-center">Comment ça marche ?</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 shadow-md">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-900">Présentez votre QR code</p>
              <p className="text-xs text-blue-700">à chaque achat</p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 shadow-md">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-900">Gagnez 1 point</p>
              <p className="text-xs text-blue-700">par bobine achetée</p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 shadow-md">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-900">Recevez vos cadeaux</p>
              <p className="text-xs text-blue-700">automatiquement</p>
            </div>
          </div>

          {/* Récompenses */}
          <div className="bg-white rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Vos récompenses :</p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</span>
                <span className="text-sm text-gray-700">= Accessoire offert</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">15</span>
                <span className="text-sm text-gray-700">= Bobine Bambu Lab</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
