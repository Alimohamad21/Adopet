import React,{ createContext, useState } from 'react';

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    return (
        <CurrentUserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

