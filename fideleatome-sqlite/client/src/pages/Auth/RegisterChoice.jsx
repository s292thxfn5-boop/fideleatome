import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">FideleAtome</h1>
          <p className="text-gray-600 text-lg">Choisissez votre type de compte</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Carte Client */}
          <div
            onClick={() => navigate(ROUTES.REGISTER_CUSTOMER)}
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Je suis un Client</h2>
              <p className="text-gray-600 mb-4">
                Accédez à votre carte de fidélité digitale et suivez vos points
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Carte de fidélité QR code
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Suivi de vos points et récompenses
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Historique de vos achats
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 font-medium">
                S'inscrire comme client
              </button>
            </div>
          </div>

          {/* Carte Entreprise */}
          <div
            onClick={() => navigate(ROUTES.REGISTER_BUSINESS)}
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Je suis une Entreprise</h2>
              <p className="text-gray-600 mb-4">
                Gérez votre programme de fidélité et vos clients
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Scanner de QR codes clients
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Gestion des points et récompenses
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Statistiques de ventes
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 font-medium">
                S'inscrire comme entreprise
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterChoice;
