import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function QRScanner({ onScanSuccess, onScanError }) {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const codeReaderRef = useRef(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const startScanning = async () => {
      try {
        setIsScanning(true);
        setError(null);

        // Lister les caméras disponibles
        const videoInputDevices = await codeReader.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          setError('Aucune caméra détectée');
          return;
        }

        // Utiliser la première caméra disponible
        const firstDeviceId = videoInputDevices[0].deviceId;

        // Démarrer le scan
        await codeReader.decodeFromVideoDevice(
          firstDeviceId,
          videoRef.current,
          (result, err) => {
            if (result && !hasScannedRef.current) {
              try {
                const rawText = result.getText();
                console.log('QR Code lu:', rawText);

                // Parser le JSON pour vérifier
                const qrData = JSON.parse(rawText);

                // Vérifier que c'est bien un QR code FideleAtome
                if (qrData.app === 'fideleatome' && qrData.type === 'customer') {
                  hasScannedRef.current = true;
                  // Passer la chaîne brute, pas l'objet parsé
                  onScanSuccess(rawText);
                  // Arrêter le scanner après un scan réussi
                  codeReader.reset();
                } else {
                  onScanError('QR code invalide');
                }
              } catch (parseError) {
                console.error('Erreur parsing QR:', parseError);
                onScanError('QR code non reconnu');
              }
            }
            if (err && !(err.name === 'NotFoundException')) {
              console.error('Scan error:', err);
            }
          }
        );
      } catch (err) {
        console.error('Scanner initialization error:', err);
        setError('Erreur d\'accès à la caméra. Veuillez autoriser l\'accès.');
      }
    };

    startScanning();

    // Cleanup
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full rounded-lg border-4 border-primary-600"
          style={{ maxHeight: '400px' }}
        />

        {/* Overlay de scan */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-4 border-white rounded-lg opacity-50"></div>
        </div>

        {/* Indicateur de scan */}
        {isScanning && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            📷 Scan en cours...
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-gray-600 mt-4">
        Placez le QR code du client devant la caméra
      </p>
    </div>
  );
}

export default QRScanner;
