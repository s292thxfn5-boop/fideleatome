import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QRCodeCard({ qrToken, customerName, customerId, firstName, lastName, points }) {
  // Format structuré pour le QR code avec toutes les infos du client
  const qrData = JSON.stringify({
    app: 'fideleatome',
    type: 'customer',
    id: customerId,
    token: qrToken,
    name: customerName,
    first_name: firstName,
    last_name: lastName,
    points: points || 0
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        Votre Carte de Fidélité
      </h3>

      <div className="flex flex-col items-center">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg border-4 border-primary-600 mb-4">
          <QRCodeSVG
            value={qrData}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Customer Info */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{customerName}</p>
          <p className="text-sm text-gray-500 mt-1">
            Présentez ce QR code lors de votre achat
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-primary-50 rounded-lg p-4 w-full">
          <p className="text-sm text-gray-700 text-center">
            <strong>Comment ça marche ?</strong>
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>• Présentez ce QR code à chaque achat</li>
            <li>• Obtenez 1 point par bobine achetée</li>
            <li>• La 15ème bobine est gratuite !</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QRCodeCard;
