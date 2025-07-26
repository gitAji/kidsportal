"use client";
import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [panelState, setPanelState] = useState({
    team: false,
    howItWorks: false,
    about: false,
  });

  const [modalState, setModalState] = useState({
    auth: false,
    isRegister: false,
  });

  const openPanel = (panel) => setPanelState(prev => ({ ...prev, [panel]: true }));
  const closePanel = (panel) => setPanelState(prev => ({ ...prev, [panel]: false }));
  const togglePanel = (panel) => setPanelState(prev => ({ ...prev, [panel]: !prev[panel] }));

  const openModal = (register = false) => setModalState({ auth: true, isRegister: register });
  const closeModal = () => setModalState({ auth: false, isRegister: false });

  const value = {
    panelState,
    openPanel,
    closePanel,
    togglePanel,
    modalState,
    openModal,
    closeModal,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
