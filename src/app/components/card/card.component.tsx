import React, { ImgHTMLAttributes, ReactNode } from 'react';
import styles from './card.module.css';
import pencil from '../../../assets/edit-pencil.svg'
import clockIcon from "../../../assets/clock.svg"
import arrowIcon from "../../../assets/rising-arrow.svg"

interface CardProps {
  title: string;
  icon?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, headerAction, children, className }) => {
  const hasHeader = title || headerAction;

  return (
    <div className={`${styles.cardContainer} ${className || ''}`}>
        <div className={styles.blueTopBorder} />

      {hasHeader && (
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            {icon == "clock" ? 
              <img src={clockIcon} alt="Clock icon in the color blue"/>
            : icon == "arrow" ? 
              <img src={arrowIcon} alt="Rising arrow icon in the collor blue"/>
            : null}
            {title && <h2 className={styles.title}>{title}</h2>}
          </div>
          {headerAction && <div className={styles.action}>
            <img src={pencil} alt="Pencil icon in the collor grey" />
            {headerAction}
            </div>}
        </div>
      )}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card;