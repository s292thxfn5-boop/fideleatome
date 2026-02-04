import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

function Progress() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const points = user?.profile?.points || 0;
  const totalPurchases = user?.profile?.totalPurchases || 0;
  const totalRewards = Math.floor(totalPurchases / 15);
  const progress = (points / 15) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Retour
              </button>
              <h1 className="text-xl font-bold text-primary-600">Ma Progression</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.profile?.firstName} !
          </h2>
          <p className="text-gray-600 mt-2">Suivez votre progression de fidélité</p>
        </div>

        {/* Carte de progression principale */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-lg font-semibold mb-6 text-center">Progression Actuelle</h3>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {points}/15
            </div>
            <p className="text-gray-600">Bobines achetées</p>
            <div className="mt-2 text-lg text-gray-700">
              {15 - points === 0
                ? '🎉 Bobine gratuite disponible !'
                : `Plus que ${15 - points} pour obtenir une bobine gratuite !`
              }
            </div>
          </div>

          {/* Barre de progression visuelle */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-primary-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <span className="text-white text-xs font-bold">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total achats</p>
                <p className="text-3xl font-bold text-gray-800">{totalPurchases}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Récompenses</p>
                <p className="text-3xl font-bold text-primary-600">{totalRewards}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Visualisation des bobines */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Vos bobines</h3>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                  index < points
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {points} bobine{points > 1 ? 's' : ''} collectée{points > 1 ? 's' : ''}
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Système de récompenses</h3>
          <p className="text-sm text-green-800">
            Chaque achat de bobine vous rapporte 1 point. Après 15 points, vous obtenez une bobine gratuite et votre compteur se réinitialise !
          </p>
        </div>
      </div>
    </div>
  );
}

export default Progress;
