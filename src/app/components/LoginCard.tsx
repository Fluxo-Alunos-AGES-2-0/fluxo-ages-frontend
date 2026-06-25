import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Lock,
  Calendar,
  KeyRound,
  Mail,
} from "lucide-react";
import { InputField } from "@/app/components/ui/InputField/InputField";
import { Button } from "@/app/components/ui/Button/Button";
import { QuickAccessButton } from "@/app/components/ui/QuickAccessButton/QuickAccessButton";
import logoFluxoAges from "@/app/assets/images/login/logo_fluxo_ages.webp";
import discordLogo from "@/app/assets/images/login/logo_discord.png";
import siteLogo from "@/app/assets/images/login/logo_ages.svg";
import gitlabLogo from "@/app/assets/images/login/logo_gitlab.png";
import wikiLogo from "@/app/assets/images/login/logo_wiki.png";
import { api } from "@/app/services/api";
import { useToast } from "@/app/context/ToastContext";

interface LoginCardProps {
  onOpenCronograma: () => void;
}

interface LoginResponse {
  token: string;
  expiresIn: number;
  user: { id: number; name: string; email: string; role: string };
}

export function LoginCard({ onOpenCronograma }: LoginCardProps) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{
    usuario?: string;
    senha?: string;
    recoveryEmail?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const clearError = (field: "usuario" | "senha" | "recoveryEmail") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { usuario?: string; senha?: string } = {};

    if (!usuario.trim()) newErrors.usuario = "Informe seu usuário";
    if (!senha.trim()) newErrors.senha = "Informe sua senha";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        username: usuario,
        password: senha,
      });
      localStorage.setItem("token", res.token);
      showToast({
        variant: "success",
        title: "Sucesso",
        message: "Login efetuado com sucesso!",
      });
      navigate("/dashboard");
    } catch {
      showToast({
        variant: "error",
        title: "Erro ao entrar",
        message: "Usuário ou senha inválidos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword((prev) => !prev);
    if (showForgotPassword) {
      setRecoveryEmail("");
      setErrors((prev) => ({ ...prev, recoveryEmail: undefined }));
    }
  };

  const handleRecoverySubmit = async () => {
    const newErrors: { recoveryEmail?: string } = {};
    setSuccessMessage("");

    if (!recoveryEmail.trim()) {
      newErrors.recoveryEmail = "Informe seu email";
    } else if (!/\S+@\S+\.\S+/.test(recoveryEmail)) {
      newErrors.recoveryEmail = "Informe um e-mail válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: recoveryEmail });
      setErrors((prev) => ({ ...prev, recoveryEmail: undefined }));
      setSuccessMessage("Verifique sua caixa de entrada");
      setRecoveryEmail("");
    } catch (error) {
      showToast({
        variant: "error",
        title: "Erro ao solicitar recuperação",
        message: error instanceof Error ? error.message : "Tente novamente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full bg-white rounded-[12px] flex flex-col overflow-hidden"
      style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#3B5CCC] via-[#5B7AE8] to-[#F47B20]" />

      <div
        className={`px-6 py-4 flex flex-col gap-4 transition-all duration-300 ${
          showForgotPassword
            ? "overflow-y-auto max-h-[90vh]"
            : "overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center">
              <img
                src={logoFluxoAges}
                alt="Fluxo AGES"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
          <p className="text-xs text-[#6B7280] tracking-wide uppercase">
            Acesse sua conta
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3"
        >
          <InputField
            id="usuario"
            label="Usuário"
            type="text"
            placeholder="Digite seu usuário"
            icon={<User className="w-4 h-4" />}
            value={usuario}
            onChange={(v) => {
              setUsuario(v);
              clearError("usuario");
            }}
            error={errors.usuario}
            autoComplete="username"
          />

          <InputField
            id="senha"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            icon={<Lock className="w-4 h-4" />}
            value={senha}
            onChange={(v) => {
              setSenha(v);
              clearError("senha");
            }}
            error={errors.senha}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            className="py-2.5 text-sm"
            style={{ fontWeight: 600 }}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="flex items-center justify-center gap-2 text-sm text-[#3B5CCC] hover:text-[#2d4db3] hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>
                {showForgotPassword ? "Ocultar recuperação" : "Esqueci a senha"}
              </span>
            </button>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showForgotPassword
                ? "grid-rows-[1fr] opacity-100 mt-2"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-3 pt-1">
                <InputField
                  id="recoveryEmail"
                  label="E-mail"
                  type="email"
                  placeholder="Insira seu e-mail"
                  icon={<Mail className="w-4 h-4" />}
                  value={recoveryEmail}
                  onChange={(v) => {
                    setRecoveryEmail(v);
                    clearError("recoveryEmail");
                  }}
                  error={errors.recoveryEmail}
                  autoComplete="email"
                />

                <Button
                  type="button"
                  fullWidth
                  className="py-2.5 text-sm bg-[#2d4db3] text-white hover:bg-[#243f94] transition-all duration-200"
                  style={{ fontWeight: 600 }}
                  onClick={handleRecoverySubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Confirmar"}
                </Button>

                {successMessage && (
                  <p className="text-sm text-green-600 text-center">
                    {successMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">
            Acesso rápido
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* Ícones de acesso rápido */}
        <div className="flex items-start justify-around gap-2">
          <QuickAccessButton
            icon={<img src={discordLogo} alt="Discord" className="w-8 h-8 object-contain" />}
            label="Discord"
            href="https://discord.com/invite/wVtRNuqZUq"
            iconOnly
          />
          <QuickAccessButton
            icon={<img src={siteLogo} alt="Site" className="w-8 h-8 object-contain" />}
            label="AGES"
            href="https://ages.pucrs.br"
            iconOnly
          />
          <QuickAccessButton
            icon={<img src={gitlabLogo} alt="GitLab" className="w-14 h-14 object-contain" />}
            label="GitLab"
            href="https://tools.ages.pucrs.br"
            iconOnly
          />
          <QuickAccessButton
            icon={<img src={wikiLogo} alt="Wiki" className="w-9 h-9 object-contain" />}
            label="Wiki"
            href="https://tools.ages.pucrs.br/modelos/estudos/tutorialFluxoAges/-/wikis/home"
            iconOnly
          />
        </div>

        {/* Botão Cronograma */}
        <QuickAccessButton
          icon={<Calendar className="w-4 h-4" />}
          label="Cronograma"
          onClick={onOpenCronograma}
        />

        <p className="text-center text-[11px] text-[#9CA3AF]">
          © {new Date().getFullYear()} FluxoAGES · PUCRS · Todos os direitos
          reservados
        </p>
      </div>
    </div>
  );
}