import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CommunicationLanguage,
  PhilippineClientConfig,
  formatPHP,
  formatPhilippineName,
  formatPhilippineAddress,
  PHILIPPINE_REGULATORY_DISCLAIMER,
  getLocalizedScript,
  PhilippineAddress,
  PhilippineCustomerName,
} from '../services/philippineCollections';

export interface PhilippineLocalizationContextType {
  // Active settings
  communicationLanguage: CommunicationLanguage;
  setCommunicationLanguage: (lang: CommunicationLanguage) => void;
  
  // Organization / Client Context
  clientConfig: PhilippineClientConfig;
  setClientConfig: (config: PhilippineClientConfig) => void;
  
  // Timezone & Currency Defaults
  timezone: string;
  currencySymbol: string;
  currencyCode: string;
  
  // Utility Functions
  formatCurrency: (amount: number | string | undefined | null) => string;
  formatName: (name: PhilippineCustomerName) => string;
  formatAddress: (addr: PhilippineAddress) => string;
  getScript: (key: string, customParams?: Record<string, string | number>) => string;
  regulatoryDisclaimer: string;
  
  // Drawer / Inspector Modal State
  isLocalizationDrawerOpen: boolean;
  setIsLocalizationDrawerOpen: (open: boolean) => void;
}

export const DEFAULT_PHILIPPINE_CLIENT: PhilippineClientConfig = {
  clientId: 'bdo-unibank-retail',
  clientName: 'BDO Unibank Inc. — Consumer Lending Group',
  sector: 'UNIVERSAL_BANK',
  shortCode: 'BDO-CONS-01',
  preferredLanguage: 'TAGLISH',
  agencyLabel: 'ECA',
  regulatoryRail: 'BSP Circular 454 & SEC MC-18 Compliant',
  fieldVisitPermitted: true,
  legalEscalationThresholdDays: 180,
};

const PhilippineLocalizationContext = createContext<PhilippineLocalizationContextType | undefined>(undefined);

export const PhilippineLocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [communicationLanguage, setCommunicationLanguage] = useState<CommunicationLanguage>('TAGLISH');
  const [clientConfig, setClientConfig] = useState<PhilippineClientConfig>(DEFAULT_PHILIPPINE_CLIENT);
  const [isLocalizationDrawerOpen, setIsLocalizationDrawerOpen] = useState<boolean>(false);

  const timezone = 'Asia/Manila (PHT UTC+08:00)';
  const currencySymbol = '₱';
  const currencyCode = 'PHP';

  const formatCurrency = (amount: number | string | undefined | null) => formatPHP(amount);
  const formatName = (name: PhilippineCustomerName) => formatPhilippineName(name);
  const formatAddress = (addr: PhilippineAddress) => formatPhilippineAddress(addr);

  const getScript = (key: string, customParams?: Record<string, string | number>) => {
    return getLocalizedScript(key, communicationLanguage, customParams);
  };

  return (
    <PhilippineLocalizationContext.Provider
      value={{
        communicationLanguage,
        setCommunicationLanguage,
        clientConfig,
        setClientConfig,
        timezone,
        currencySymbol,
        currencyCode,
        formatCurrency,
        formatName,
        formatAddress,
        getScript,
        regulatoryDisclaimer: PHILIPPINE_REGULATORY_DISCLAIMER,
        isLocalizationDrawerOpen,
        setIsLocalizationDrawerOpen,
      }}
    >
      {children}
    </PhilippineLocalizationContext.Provider>
  );
};

export const usePhilippineLocalization = (): PhilippineLocalizationContextType => {
  const context = useContext(PhilippineLocalizationContext);
  if (!context) {
    throw new Error('usePhilippineLocalization must be used within a PhilippineLocalizationProvider');
  }
  return context;
};
