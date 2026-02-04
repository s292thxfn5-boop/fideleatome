import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import logo from '../../assets/logo.png';

function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 relative">
      <img src={logo} alt="Atome 3D Grand Paris Sud" className="absolute top-4 left-4 h-16" />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <p className="text-gray-600 text-lg">Créez votre compte client</p>
          </div>

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
                S'inscrire
              </button>
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
    </div>
  );
}

export default RegisterChoice;
