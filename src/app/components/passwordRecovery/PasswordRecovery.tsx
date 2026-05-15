import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { InputField } from "../ui/InputField/InputField";
import { Button } from "../ui/Button/Button";
import BackgroundImage from "../../assets/images/login/bg/bg-01.webp";
import LogoFluxo from "../../assets/images/login/logo_fluxo_ages.webp";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const MIN_PASSWORD_LENGTH = 8;

const PasswordRecovery = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useState<string | null>(searchParams.get("token"));
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Token de recuperação não encontrado na URL");
    }
  }, [token]);

  useEffect(() => {
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();
    const passwordsMatch = trimmedPassword === trimmedConfirm;
    const meetsLength = trimmedPassword.length >= MIN_PASSWORD_LENGTH;
    const isNotEmpty = trimmedPassword.length > 0 && trimmedConfirm.length > 0;

    setIsFormValid(passwordsMatch && meetsLength && isNotEmpty);

    if (trimmedPassword.length > 0 && !meetsLength) {
      setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
    } else if (trimmedConfirm.length > 0 && !passwordsMatch) {
      setError("As senhas não coincidem");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !token) return;

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      showToast({
        variant: "success",
        title: "Sucesso",
        message: "Senha alterada com sucesso!",
      });

      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao redefinir senha";

      if (errorMessage.includes("400")) {
        setTokenError(
          "Token expirado ou já utilizado. Solicite uma nova recuperação."
        );
      } else {
        showToast({
          variant: "error",
          title: "Erro ao redefinir senha",
          message: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-center z-10">
          <img src={LogoFluxo} alt="FluxoAGES" className="mb-2 w-32" />

          <h2 className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-semibold mb-6">
            Recuperação de Senha
          </h2>

          <div className="w-full text-center">
            <p className="text-red-500 text-sm mb-6">{tokenError}</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-[#3b59c8] hover:bg-[#2f48a3] text-white py-2.5 rounded-md font-medium transition-all"
            >
              Voltar para Login
            </Button>
          </div>

          <footer className="mt-8 text-[9px] text-gray-400 text-center">
            © 2026 FluxoAGES - PUCRS · Todos os direitos reservados
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-center z-10">
        <img src={LogoFluxo} alt="FluxoAGES" className="mb-2 w-32" />

        <h2 className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-semibold mb-6">
          Redefinir Senha
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <InputField
            label="Nova Senha"
            type="password"
            name="password"
            value={password}
            onChange={(val) => setPassword(val)}
            placeholder="Digite sua senha"
            disabled={isLoading}
          />

          <div className="space-y-1">
            <InputField
              label="Confirmar Senha"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val)}
              placeholder="Confirme sua senha"
              disabled={isLoading}
            />
            {error && (
              <span className="text-red-500 text-[10px] ml-1">{error}</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#3b59c8] hover:bg-[#2f48a3] text-white py-2.5 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? "Confirmando..." : "Confirmar"}
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
