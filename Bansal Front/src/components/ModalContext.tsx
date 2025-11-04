// modal-context.tsx
import React, { createContext, useContext, useState } from 'react';

interface ModalContextProps {
  showLogin: boolean;
  showOTP: boolean;
  showRegister: boolean;
  phone: string;
  openLogin: () => void;
  closeLogin: () => void;
  openOTP: (phone: string) => void;
  closeOTP: () => void;
  openRegister: () => void;
  closeRegister: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [phone, setPhone] = useState<string>('');

  const openLogin = () => {
    setShowOTP(false);
    setShowRegister(false);
    setShowLogin(true);
  };

  const closeLogin = () => setShowLogin(false);

  const openOTP = (phone: string) => {
    setPhone(phone);
    setShowLogin(false);
    setShowRegister(false);
    setShowOTP(true);
  };

  const closeOTP = () => setShowOTP(false);

  const openRegister = () => {
    setShowLogin(false);
    setShowOTP(false);
    setShowRegister(true);
  };

  const closeRegister = () => setShowRegister(false);

  return (
    <ModalContext.Provider
      value={{
        showLogin,
        showOTP,
        showRegister,
        phone,
        openLogin,
        closeLogin,
        openOTP,
        closeOTP,
        openRegister,
        closeRegister
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
