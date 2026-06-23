import React from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { InDevelopmentMonitor } from '../components/InDevelopment/InDevelopmentMonitor';

export const InDevelopmentPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full p-6 bg-[#F3F4F6]">
      
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-sm border-t-4 border-[#3B82F6] p-8 flex flex-col">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-[#F97316]">
            Tela em desenvolvimento
          </h1>
          <button 
            onClick={handleGoBack}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            aria-label="Voltar para a página anterior"
          >
            <X size={28} />
          </button>
        </div>

        <p className="text-gray-500 mt-6 text-base">
          Não há nada para ver aqui por enquanto.
        </p>
        <div className="flex justify-center items-center flex-1">
          <InDevelopmentMonitor />
        </div>

      </div>
    </div>
  );
};