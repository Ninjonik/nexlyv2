"use client"

import {useEffect} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";

export const ClientWrapper = ({children} : {children: React.ReactNode}) => {

    useEffect(() => {

        /* Runs on initial page load */
        const handleLoad = () => {
            const user = localStorage.getItem("user")
            if(user){
                const parsedUser = JSON.parse(user) as UserLocalStorageInterface;
                localStorage.removeItem("user")
                navigator.sendBeacon(`/api/deleteUser`,
                    JSON.stringify({
                        token: parsedUser.token
                    })
                );
            }
        }

        handleLoad()

        /* RUN ON PAGE EXIT */
        const handleUnload = () => {
            console.log("removing cookies data")
            const user = localStorage.getItem("user")
            if(user){
                const parsedUser = JSON.parse(user) as UserLocalStorageInterface;
                localStorage.removeItem("user")
                navigator.sendBeacon(`/api/deleteUser`,
                    JSON.stringify({
                        token: parsedUser.token
                    })
                );
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        /* END */

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    return (
        <>
            {children}
        </>
    );
};