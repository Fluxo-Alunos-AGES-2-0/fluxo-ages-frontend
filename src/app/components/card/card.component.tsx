import React, { ReactNode } from "react";
import styles from "./card.module.css";
import pencil from "../../../assets/edit-pencil.svg";
import clockIcon from "../../../assets/clock.svg";
import arrowIcon from "../../../assets/rising-arrow.svg";

interface CardProps {
  title?: string;
  icon?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  classContent?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  headerAction,
  children,
  className,
  classContent,
}) => {
  const hasHeader = !!title;

  return (
    <div
      className={`
      ${styles.cardContainer} 
      ${!hasHeader ? styles.noHeader : ""} 
      ${className || ""}
    `}
    >
      <div className={styles.blueTopBorder} />

      {hasHeader && (
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            {icon === "clock" && <img src={clockIcon} alt="Clock icon" />}
            {icon === "arrow" && (
              <img src={arrowIcon} alt="Rising arrow icon" />
            )}
            {title && <h2 className={styles.title}>{title}</h2>}
          </div>
          {headerAction && (
            <div className={styles.action}>
              <img src={pencil} alt="Edit icon" />
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={`${styles.cardContent} ${classContent || ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
