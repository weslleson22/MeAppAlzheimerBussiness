import React, { createContext, useContext, ReactNode } from 'react';
import { useStandaloneUser, User } from '../hooks/useUser';

export type UserContextData = ReturnType<typeof useStandaloneUser>;

export const UserContext = createContext<UserContextData | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userState = useStandaloneUser();

  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export type { User };

