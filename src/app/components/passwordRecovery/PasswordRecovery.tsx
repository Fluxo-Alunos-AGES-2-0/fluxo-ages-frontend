import React, { useState, useEffect } from 'react';
import { InputField } from "../ui/InputField/InputField";
import { Button } from "../ui/Button/Button";
import BackgroundImage from '../../assets/images/login/bg/bg-01.webp';
import LogoFluxo from '../../assets/images/login/logo_fluxo_ages.webp';
import toast, { Toaster } from 'react-hot-toast';

const PasswordRecovery = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const passwordsMatch = password === confirmPassword;
    const isNotEmpty = password.length > 0 && confirmPassword.length > 0;
    setIsFormValid(passwordsMatch && isNotEmpty);

    if (confirmPassword.length > 0 && !passwordsMatch) {
      setError('As senhas não coincidem');
    } else {
      setError('');
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid) {
      toast.success(
        (t) => (
          <div className="flex items-center gap-4">
            <div className="text-white text-2xl">✓</div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Sucesso</span>
              <span className="text-white text-xs">Senha alterada com sucesso!</span>
            </div>
          </div>
        ),
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50', 
            padding: '6px 10px',
            borderRadius: '0px', 
            maxWidth: '400px',
          },
          icon: null, 
        }
      );
      
      setPassword('');
      setConfirmPassword('');
    }
  }; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: `url(${BackgroundImage})` }}>
      
      <Toaster position="top-right" />
      
      {/* Overlay de desfoque conforme critério de aceitação */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      
      {/* Container Branco com largura reduzida */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-center z-10">
        
        <img src={LogoFluxo} alt="FluxoAGES" className="mb-2 w-32" />
        
        <h2 className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-semibold mb-6">
          Mudança de Senha
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <InputField 
            label="Nova Senha"
            type="password"
            name="password" 
            value={password}
            onChange={(val) => setPassword(val)}
            placeholder="Digite sua senha"
          />

          <div className="space-y-1">
            <InputField 
              label="Confirmar Senha"
              type="password"
              name="confirmPassword" 
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val)}
              placeholder="Digite sua senha"
            />
            {error && <span className="text-red-500 text-[10px] ml-1">{error}</span>}
          </div>

          <Button 
            type="submit" 
            disabled={!isFormValid}
            className="w-full bg-[#3b59c8] hover:bg-[#2f48a3] text-white py-2.5 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Confirmar
          </Button>
        </form>

        <footer className="mt-8 text-[9px] text-gray-400 text-center">
          © 2026 FluxoAGES - PUCRS · Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
};

export default PasswordRecovery;