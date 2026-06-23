import React, { useRef, useState, useEffect } from 'react';
import { X, UploadCloud, LoaderCircle, User } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, updateUser } = useAuth(); 
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(user?.avatarUrl || null);
      setError(null);
    } else {
      if (previewUrl && !selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [isOpen, user?.avatarUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Por favor, envie uma imagem PNG, JPG, JPEG ou WEBP.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('A imagem é muito grande. O tamanho máximo permitido é 5MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append('file', selectedFile);

      const response = await api.put<{ imageUrl: string }>('/students/me/avatar', formData);

      updateUser({ avatarUrl: response.imageUrl });

      showToast({
        variant: "success",
        title: "Perfil atualizado",
        message: "Sua foto de perfil foi alterada com sucesso.",
      });
      
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao salvar a imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[12px] w-full max-w-[450px] flex flex-col overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-[20px] font-semibold text-[#1f2937]">Editar Foto de Perfil</h2>
          <button onClick={onClose} disabled={isLoading} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-8 flex flex-col items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => !isLoading && fileInputRef.current?.click()}>
            <div className={`w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-slate-50 flex items-center justify-center bg-slate-100 shadow-sm transition-all ${isLoading ? 'opacity-50' : 'group-hover:border-blue-50'}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-slate-400" />
              )}
            </div>
            
            {!isLoading && (
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <UploadCloud size={24} />
                <span className="text-[11px] font-medium">Alterar</span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
            className="hidden"
          />

          <div className="text-center flex flex-col gap-1">
            <p className="text-sm text-slate-600 font-medium">Clique na imagem para alterar</p>
            <p className="text-xs text-slate-400">Formatos aceitos: JPG, JPEG ou PNG (Máx. 5MB)</p>
          </div>

          {error && (
            <div className="w-full bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="!border-[#e5e7eb] !text-slate-600 !bg-white hover:!bg-slate-50">
            Cancelar
          </Button>
          
          <Button variant="primary" onClick={handleSave} disabled={!selectedFile || isLoading} className="!bg-[#3b5ccc] flex items-center gap-2 min-w-[120px] justify-center">
            {isLoading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Foto"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};