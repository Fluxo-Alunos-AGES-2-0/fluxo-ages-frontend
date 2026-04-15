import React from 'react';
import style from './circularProgress.module.css';

interface CircularProgressProps {
  percentage: number;   // Valor exato de 0 a 100
  size?: number;         // Diâmetro do círculo em pixels
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
}) => {
  const validPercentage = Math.max(0, Math.min(100, percentage));
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Cálculo do offset: quanto da borda será 'empurrado' para fora da vista.
  // Se for 100%, o offset é 0 (borda total visível).
  // Se for 0%, o offset é igual à circunferência total (borda invisível).
  const progressOffset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className={style.progressContainer} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={style.progressSvg}>
        {/* Círculo de Fundo (Trilho) */}
        <circle
          className={style.progressBackground}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Círculo de Progresso Ativo (Barra Contínua) */}
        <circle
          className={style.progressBar}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          // Define o padrão tracejado como a circunferência inteira
          strokeDasharray={circumference} 
          // Define onde o preenchimento começa
          strokeDashoffset={progressOffset} 
        />
      </svg>
      
      {/* Texto centralizado, escalonado proporcionalmente ao tamanho do círculo */}
      <div className={style.progressTextWrapper}>
        <span className={style.progressPercentage} style={{ fontSize: size * 0.22 }}>
          {validPercentage}%
        </span>
        <span className={style.progressLabel} style={{ fontSize: size * 0.07 }}>
          Concluído
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
