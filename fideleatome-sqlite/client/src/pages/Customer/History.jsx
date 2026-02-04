import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { getPurchaseHistory, getRewardHistory } from '../../api/customer';

function History() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      if (activeTab === 'purchases') {
        const data = await getPurchaseHistory({ limit: 100 });
        setPurchases(data.purchases || []);
      } else {
        const data = await getRewardHistory({ limit: 100 });
        setRewards(data.rewards || []);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <h1 className="text-xl font-bold text-primary-600">Mon Historique</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.profile?.firstName} !
          </h2>
          <p className="text-gray-600 mt-2">Consultez l'historique de vos achats et récompenses</p>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'purchases'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mes Achats
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'rewards'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mes Récompenses
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-600 mt-4">Chargement...</p>
              </div>
            ) : activeTab === 'purchases' ? (
              <div>
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500 text-lg">Aucun achat pour le moment</p>
                    <p className="text-gray-400 text-sm mt-2">Présentez votre QR code lors de votre prochain achat</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              purchase.isReward
                                ? 'bg-green-100'
                                : 'bg-primary-100'
                            }`}>
                              {purchase.isReward ? (
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {purchase.isReward ? 'Bobine gratuite utilisée' : `${purchase.pointsAdded} bobine${purchase.pointsAdded > 1 ? 's' : ''} achetée${purchase.pointsAdded > 1 ? 's' : ''}`}
                              </p>
                              <p className="text-sm text-gray-500">{formatDate(purchase.purchaseDate)}</p>
                              {purchase.businessName && (
                                <p className="text-xs text-gray-400 mt-1">{purchase.businessName}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              purchase.isReward
                                ? 'bg-green-100 text-green-800'
                                : 'bg-primary-100 text-primary-800'
                            }`}>
                              {purchase.isReward ? '🎁 Gratuit' : `+${purchase.pointsAdded} pts`}
                            </span>
                          </div>
                        </div>
                        {purchase.notes && (
                          <p className="text-sm text-gray-600 mt-2 pl-16">{purchase.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {rewards.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <p className="text-gray-500 text-lg">Aucune récompense pour le moment</p>
                    <p className="text-gray-400 text-sm mt-2">Continuez vos achats pour obtenir des bobines gratuites !</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-green-900">Bobine gratuite obtenue 🎉</p>
                              <p className="text-sm text-green-700">{formatDate(reward.rewardDate)}</p>
                              {reward.businessName && (
                                <p className="text-xs text-green-600 mt-1">{reward.businessName}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                              🎁 Récompense
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Résumé</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Total achats</p>
              <p className="text-2xl font-bold text-blue-900">{user?.profile?.totalPurchases || 0}</p>
            </div>
            <div>
              <p className="text-blue-700">Total récompenses</p>
              <p className="text-2xl font-bold text-blue-900">{Math.floor((user?.profile?.totalPurchases || 0) / 15)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
