import React from 'react';
import logoFluxoAges from '../../assets/images/login/logo_fluxo_ages.webp'; 

interface UnexpectedErrorProps {
  message?: string;
}

export default function UnexpectedError({ message }: UnexpectedErrorProps) {
  
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between font-sans">
      
      {/*Header*/}
      <header className="p-6 md:p-8">
        <img 
          src={logoFluxoAges} 
          alt="Logo Fluxo AGES" 
          className="h-8 w-auto md:h-10 select-none pointer-events-none" 
        />
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto -mt-16">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 select-none">
          Ops... Algo deu errado!
        </h1>
        
        <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md leading-relaxed select-none">
          {message || "Não conseguimos carregar os dados desta página. Tente atualizar ou volte para o início."}
        </p>
        
        {/* Ilustração do Monitor*/}
        <div className="relative w-64 h-56 md:w-72 md:h-64 mb-12 flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="border-[5px] border-[#0F172A] rounded-none w-full h-[75%] bg-white flex items-center justify-center relative shadow-sm">
            <div className="w-[55%] h-[32%] bg-[#3B62D1] rounded-md flex items-center justify-between px-3 relative">
            <div className="w-6 h-1 bg-white rounded-full opacity-90"></div>
            <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-white rounded-full opacity-90"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-90"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-90"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#EF4444] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md animate-bounce">
                !
            </div>
            </div>
        </div>
        <div className="w-10 h-12 bg-[#0F172A] "></div>
        <div className="w-28 h-1.5 bg-[#0F172A] rounded-b-full"></div>
        </div>

        <button 
          onClick={handleGoBack}
          className="bg-[#3B62D1] hover:bg-[#2A4EB3] text-white font-medium px-16 py-2.5 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Voltar
        </button>
      </main>

      <footer className="h-16"></footer>
    </div>
  );
}