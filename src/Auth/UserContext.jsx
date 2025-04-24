import React, { createContext, useState, useEffect } from 'react';
import { checkSession } from '../api'; // Add an API call to check the session

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Check session on initial load
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const user = await checkSession();
                if (user) {
                    setLoggedInUser(user.username);
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
            }
        };
        fetchSession();
    }, []);

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
};