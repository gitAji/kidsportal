"use client";
import React, { createContext, useState, useContext } from 'react';
import dynamic from 'next/dynamic';

const ToggleModal = dynamic(() => import('../components/ui/Modal'), { ssr: false });

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, isRegister, setIsRegister }}>
      {children}
      <ToggleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);