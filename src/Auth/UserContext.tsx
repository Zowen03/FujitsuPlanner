import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkSession } from '../api';

// Define types for your user data
interface User {
  username: string;
  // Add other user properties as needed
  [key: string]: unknown; // This allows for additional properties with an unknown type
}

// Define the shape of your context value
interface UserContextType {
  loggedInUser: string | null; // Assuming username is a string
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
  userDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context with initial type (null will be overwritten by Provider)
// Create the context with default values
export const UserContext = createContext<UserContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
  userDetails: null,
  setUserDetails: () => {}
});

// Define props for UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Export the provider component with proper typing
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await checkSession();
        if (result?.success) {
          setLoggedInUser(result.user.username);
          setUserDetails(result.user);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };
    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ 
      loggedInUser, 
      setLoggedInUser,
      userDetails,
      setUserDetails
    }}>
      {children}
    </UserContext.Provider>
  );
};