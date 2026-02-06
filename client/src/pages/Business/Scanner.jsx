import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import QRScanner from '../../components/QRScanner';
import { scanQRCode, addPoint } from '../../api/business';

function Scanner() {
  const navigate = useNavigate();
  const [scannedCustomer, setScannedCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [manualId, setManualId] = useState('');

  const handleManualSearch = async () => {
    if (!manualId.trim()) return;

    // Créer un faux QR data avec l'ID manuel
    const fakeQrData = JSON.stringify({
      app: 'fideleatome',
      type: 'customer',
      id: manualId.trim(),
      first_name: 'Client',
      last_name: 'Manuel',
      points: 0
    });

    await handleScanSuccess(fakeQrData);
  };

  const handleScanSuccess = async (qrData) => {
    // Éviter les scans multiples si un client est déjà scanné
    if (scannedCustomer || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('QR Code scanné:', qrData);

      // Valider le QR code avec le backend
      const result = await scanQRCode(qrData);

      setScannedCustomer(result.customer);
    } catch (err) {
      console.error('Erreur scan:', err);
      setError(err.message || 'Erreur lors de la validation du QR code');
      setScannedCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (errorMessage) => {
    setError(errorMessage);
    setScannedCustomer(null);
  };

  const handleAddPoint = async () => {
    if (!scannedCustomer) return;

    setLoading(true);
    setError(null);

    try {
      const result = await addPoint(scannedCustomer.id, quantity);

      setSuccess(result.message);

      // Mettre à jour l'affichage du client
      setScannedCustomer({
        ...scannedCustomer,
        points: result.newPoints,
        totalPurchases: result.totalPurchases,
        totalRewards: result.totalRewards
      });

      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setScannedCustomer(null);
        setSuccess(null);
        setQuantity(1);
      }, 3000);
    } catch (err) {
      console.error('Erreur ajout point:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du point');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setScannedCustomer(null);
    setError(null);
    setSuccess(null);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary-600">FideleAtome - Scanner</h1>
            <button
              onClick={() => navigate(ROUTES.BUSINESS_DASHBOARD)}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              ← Retour
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Scanner QR Code Client</h2>
          <p className="text-gray-600 mt-2">Scannez le QR code du client pour ajouter un point</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Caméra</h3>

            {!scannedCustomer && !success && (
              <>
                <QRScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                />
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Ou entrez l'ID client manuellement :</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="ID du client"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={handleManualSearch}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              </>
            )}

            {scannedCustomer && (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-24 h-24 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 font-semibold">QR Code validé !</p>
              </div>
            )}

            {success && (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-24 h-24 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-primary-600 font-bold text-xl">{success}</p>
              </div>
            )}
          </div>

          {/* Customer Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Informations Client</h3>

            {!scannedCustomer && !error && !success && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p>En attente de scan...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Erreur</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={handleCancel}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Réessayer
                </button>
              </div>
            )}

            {scannedCustomer && !success && (
              <div>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {scannedCustomer.first_name || scannedCustomer.firstName} {scannedCustomer.last_name || scannedCustomer.lastName}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Points actuels</p>
                      <p className="text-4xl font-bold text-primary-600">
                        {scannedCustomer.points || 0}/15
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total achats</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {scannedCustomer.totalPurchases || 0}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${(scannedCustomer.points / 15) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Plus que {15 - scannedCustomer.points} pour une bobine gratuite
                    </p>
                  </div>
                </div>

                {/* Sélection de quantité */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de bobines
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permettre la suppression complète
                      if (value === '') {
                        setQuantity('');
                      } else {
                        setQuantity(Math.max(1, Math.min(100, parseInt(value) || 1)));
                      }
                    }}
                    onBlur={(e) => {
                      // Quand on quitte le champ, s'assurer qu'il y a au moins 1
                      if (e.target.value === '' || parseInt(e.target.value) < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Entrez le nombre de bobines"
                  />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddPoint}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? 'Ajout en cours...'
                      : `+ Ajouter ${quantity} ${quantity > 1 ? 'points' : 'point'}`
                    }
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
