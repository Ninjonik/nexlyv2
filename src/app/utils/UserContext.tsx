"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {account} from "@/app/utils/appwrite";
import UserAuthInterface from "@/app/utils/interfaces/UserAuthInterface";

interface UserContextState {
    user: UserAuthInterface | null;
    setUser: React.Dispatch<React.SetStateAction<UserAuthInterface | null>>;
    getUserData: () => void;
    logoutUser: () => void;
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
    const [user, setUser] = useState<UserAuthInterface | null>(null);

    const getUserData = async () => {
        try {
            const acc = await account.get();
            console.info("APPWRITE ACC:", acc);
            const userStorage = localStorage.getItem("user");
            let avatar = "defaultAvatar";
            if(userStorage){
                const parsedUser = JSON.parse(userStorage) as UserLocalStorageInterface;
                avatar = parsedUser.avatar
            } else {
                await account.deleteSessions();
                return console.info("no user in localstorage found")
            }
            const updatedObject = {...acc, avatar: avatar};
            setUser(updatedObject)
            console.info("UPDATED USER OBJECT: ", updatedObject);
        } catch (e) {
            setUser(null);
        }

    }

    const logoutUser = async () => {
        try {
            localStorage.removeItem("user");
            await account.deleteSessions();
            setUser(null);
        } catch (e) {}
    }

    useEffect(() => {
        getUserData()
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, getUserData, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
