import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import QRCodeCard from '../../components/QRCodeCard';

function MyQRCode() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const profile = user?.profile;
  const customerId = profile?.id || profile?.user_id || user?.user?.id;
  const customerName = profile ? `${profile.first_name || profile.firstName || ''} ${profile.last_name || profile.lastName || ''}`.trim() : 'Client';

  // Debug
  console.log('User:', user);
  console.log('Profile:', profile);
  console.log('CustomerId:', customerId);

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
              <h1 className="text-xl font-bold text-primary-600">Mon QR Code</h1>
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
            Bonjour {profile?.first_name || profile?.firstName} !
          </h2>
          <p className="text-gray-600 mt-2">Votre carte de fidélité digitale</p>
        </div>

        {customerId ? (
          <QRCodeCard
            qrToken={customerId}
            customerId={customerId}
            customerName={customerName}
            firstName={profile?.first_name || profile?.firstName || ''}
            lastName={profile?.last_name || profile?.lastName || ''}
            points={profile?.points || 0}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">QR Code non disponible</p>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Comment l'utiliser ?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Présentez ce QR code à chaque achat de bobine</li>
            <li>• Le commerçant scannera votre code</li>
            <li>• Vous gagnerez automatiquement vos points</li>
            <li>• Après 15 bobines, la suivante est offerte !</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyQRCode;
