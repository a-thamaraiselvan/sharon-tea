import React from 'react';

interface AOSProviderProps {
  children: React.ReactNode;
}

export const AOSProvider: React.FC<AOSProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default AOSProvider;
