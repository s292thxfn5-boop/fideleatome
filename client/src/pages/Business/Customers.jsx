import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { getCustomers, getCustomerDetails, getCustomerPurchases, updatePurchase, deletePurchase } from '../../api/business';
import { QRCodeSVG } from 'qrcode.react';

function Customers() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // State pour le modal historique
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({ search, limit: 100 });
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async (customer) => {
    try {
      // Récupérer les détails complets du client
      const details = await getCustomerDetails(customer.id);
      setSelectedCustomer(details.customer);
      setShowQRModal(true);
    } catch (error) {
      console.error('Erreur chargement détails client:', error);
    }
  };

  const handleShowHistory = async (customer) => {
    try {
      setHistoryCustomer(customer);
      setShowHistoryModal(true);
      setLoadingPurchases(true);
      setActionMessage(null);
      setEditingPurchaseId(null);
      setConfirmDeleteId(null);

      const data = await getCustomerPurchases(customer.id);
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Erreur chargement achats:', error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
    setHistoryCustomer(null);
    setPurchases([]);
    setEditingPurchaseId(null);
    setConfirmDeleteId(null);
    setActionMessage(null);
  };

  const handleStartEdit = (purchase) => {
    setEditingPurchaseId(purchase.id);
    setEditQuantity(purchase.points_added.toString());
    setConfirmDeleteId(null);
    setActionMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingPurchaseId(null);
    setEditQuantity('');
  };

  const handleSaveEdit = async (purchaseId) => {
    try {
      setActionLoading(true);
      setActionMessage(null);
      const result = await updatePurchase(purchaseId, parseInt(editQuantity));
      setActionMessage({ type: 'success', text: result.message });
      setEditingPurchaseId(null);

      // Recharger les achats et la liste des clients
      const data = await getCustomerPurchases(historyCustomer.id);
      setPurchases(data.purchases || []);

      // Mettre à jour le client dans la liste
      setHistoryCustomer(prev => ({
        ...prev,
        points: result.points,
        totalPurchases: result.totalPurchases,
        totalRewards: result.totalRewards,
      }));
      loadCustomers();
    } catch (error) {
      setActionMessage({ type: 'error', text: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      setActionLoading(true);
      setActionMessage(null);
      const result = await deletePurchase(purchaseId);
      setActionMessage({ type: 'success', text: result.message });
      setConfirmDeleteId(null);

      // Recharger les achats et la liste des clients
      const data = await getCustomerPurchases(historyCustomer.id);
      setPurchases(data.purchases || []);

      // Mettre à jour le client dans la liste
      setHistoryCustomer(prev => ({
        ...prev,
        points: result.points,
        totalPurchases: result.totalPurchases,
        totalRewards: result.totalRewards,
      }));
      loadCustomers();
    } catch (error) {
      setActionMessage({ type: 'error', text: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer le QR code data pour un client
  const getQRCodeData = (customer) => {
    if (!customer) return '';
    return JSON.stringify({
      app: 'fideleatome',
      type: 'customer',
      id: customer.id,
      token: customer.qrToken || customer.id,
      name: `${customer.first_name || customer.firstName} ${customer.last_name || customer.lastName}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(ROUTES.BUSINESS_DASHBOARD)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Retour
              </button>
              <h1 className="text-xl font-bold text-primary-600">Mes Clients</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {user?.profile?.businessName}
          </h2>
          <p className="text-gray-600 mt-2">Liste de vos clients fidèles</p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client par nom ou prénom..."
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">
                {search ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
              </p>
              {search && (
                <p className="text-gray-400 text-sm mt-2">Essayez une autre recherche</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Achats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Récompenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernier Achat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-lg">
                              {(customer.first_name || customer.firstName || '?').charAt(0)}{(customer.last_name || customer.lastName || '?').charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.first_name || customer.firstName} {customer.last_name || customer.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800">
                          {customer.points}/15
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{customer.totalPurchases || 0}</div>
                        <div className="text-xs text-gray-500">bobines</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{customer.totalRewards || 0}</div>
                        <div className="text-xs text-gray-500">gratuites</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.lastPurchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleShowHistory(customer)}
                            className="text-orange-600 hover:text-orange-900 font-semibold"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleShowQR(customer)}
                            className="text-primary-600 hover:text-primary-900 font-semibold"
                          >
                            QR Code
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && customers.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-blue-700">Total clients</p>
                <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Achats totaux</p>
                <p className="text-2xl font-bold text-blue-900">
                  {customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Récompenses données</p>
                <p className="text-2xl font-bold text-blue-900">
                  {customers.reduce((sum, c) => sum + (c.totalRewards || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      {showQRModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">QR Code Client</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {selectedCustomer.first_name || selectedCustomer.firstName} {selectedCustomer.last_name || selectedCustomer.lastName}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {selectedCustomer.points}/15 points
              </p>

              <div className="bg-white p-4 rounded-lg border-4 border-primary-600 inline-block">
                <QRCodeSVG
                  value={getQRCodeData(selectedCustomer)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Le client peut utiliser ce QR code pour ses achats
              </p>

              <button
                onClick={() => setShowQRModal(false)}
                className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historique des achats */}
      {showHistoryModal && historyCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Modifier les achats</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {historyCustomer.firstName || historyCustomer.first_name} {historyCustomer.lastName || historyCustomer.last_name}
                </p>
              </div>
              <button
                onClick={handleCloseHistory}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stats du client */}
            <div className="px-6 py-3 bg-gray-50 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-lg font-bold text-primary-600">{historyCustomer.points}/15</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total achats</p>
                  <p className="text-lg font-bold text-gray-900">{historyCustomer.totalPurchases || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Récompenses</p>
                  <p className="text-lg font-bold text-gray-900">{historyCustomer.totalRewards || 0}</p>
                </div>
              </div>
            </div>

            {/* Message d'action */}
            {actionMessage && (
              <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
                actionMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {actionMessage.text}
              </div>
            )}

            {/* Liste des achats */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingPurchases ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun achat enregistré</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">{formatDateTime(purchase.purchase_date)}</p>
                          {editingPurchaseId === purchase.id ? (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                className="w-20 px-2 py-1 border-2 border-primary-400 rounded-lg text-center font-bold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                              <span className="text-sm text-gray-600">bobine(s)</span>
                              <button
                                onClick={() => handleSaveEdit(purchase.id)}
                                disabled={actionLoading || !editQuantity || parseInt(editQuantity) < 1}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading ? '...' : 'OK'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              {purchase.points_added} bobine{purchase.points_added > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {editingPurchaseId !== purchase.id && confirmDeleteId !== purchase.id && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleStartEdit(purchase)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => { setConfirmDeleteId(purchase.id); setEditingPurchaseId(null); setActionMessage(null); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Confirmation de suppression */}
                      {confirmDeleteId === purchase.id && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 mb-2">Supprimer cet achat ? Les points seront recalculés.</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeletePurchase(purchase.id)}
                              disabled={actionLoading}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              {actionLoading ? '...' : 'Confirmer'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <button
                onClick={handleCloseHistory}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
