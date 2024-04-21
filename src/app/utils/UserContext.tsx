"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";

interface UserContextState {
    user: UserLocalStorageInterface | null;
    setUser: React.Dispatch<React.SetStateAction<UserLocalStorageInterface | null>>;
}


interface UserContextProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextState | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};

export const UserContextProvider = ({ children }: UserContextProps) => {
    const [user, setUser] = useState<UserLocalStorageInterface | null>(null);

    useEffect(() => {

        const userStorage = localStorage.getItem("user")
        if(userStorage){
            const parsedUser = JSON.parse(userStorage) as UserLocalStorageInterface;
            setUser(parsedUser)
        } else {
            setUser(null)
            console.info("no user found")
        }

    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
