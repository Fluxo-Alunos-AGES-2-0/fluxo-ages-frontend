
import { useEffect, useRef, useState } from "react";
import "./Modal.css"
import { Calendar } from 'lucide-react';
import { Clock4 } from 'lucide-react';


function Modal({ isOpen, onClose, title, children, footer, data, horario, categoria  }) {
  
  const modalRef =useRef(null);
  const [show, setShow] = useState(isOpen);
  
    
  useEffect(() => {
      if (isOpen) {
        setShow(true);
      } else {
        setTimeout(() => setShow(false), 300);
      }
    }, [isOpen]);


 

  useEffect(() => {
        if (!isOpen) return;
            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);


    useEffect(() => {
        if (!isOpen) return ;

       const handleTab = (event) => {
        if (event.key !== "Tab") return;
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        if (!modalRef.current.contains(document.activeElement)) {
          event.preventDefault();
          focusableElements[0].focus();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
  };
  

  document.addEventListener("keydown", handleTab);

  return () => {
    document.removeEventListener("keydown", handleTab);
  };}, [isOpen]);



  if (!show) return null;
  return (
  <div 
  className={`modal-backdrop ${isOpen ? "open" : "closing"}`}
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }}
>

    <div className="modal" ref={modalRef}>
      <div className="modal-header">
        <h2>{title}</h2>
          <div className="header-right">
            {categoria && <span className="badge">{categoria}</span>}
            <button onClick={onClose}>X</button>
          </div>
        </div>

      <div className="modal-body">
          {data && horario && (
          <div className="event-info">
            <div className="event-item">
              <div className="iconBox"><Calendar size={16} /></div>
          <p>{data}</p>
          </div>

        <div className="event-item">
          <div className="iconBox">
            <Clock4 size={16} />
          </div>
          <p>{horario}</p>
        </div>

      </div>
          )}
        {children}
      </div>

      <div className="modal-footer">
        {footer}
      </div>
    </div>
  </div>
);
}

export default Modal;