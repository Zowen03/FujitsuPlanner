import React, { createContext, useState, useEffect } from 'react';
import { checkSession } from '../api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const result = await checkSession();
                if (result.success) {
                    setLoggedInUser(result.user.username);
                    setUserDetails(result.user);
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
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