"use client"

import React, {useEffect, useState} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {LoadingFullscreen} from "@/app/components/LoadingFullscreen";
import {useRouter} from "next/navigation";
import {UserContextProvider, useUserContext} from "@/app/utils/UserContext";
import {account} from "@/app/utils/appwrite";
import {ToastContainer} from "react-toastify";

export const ClientWrapper = ({children} : {children: React.ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(true);
    const {user, setUser} = useUserContext();
    const router = useRouter();

    const middlewareFunction = async () => {
        let loggedIn = false;

        /* Runs on initial page load */
        const handleLoad = async () => {
            if(user){
                localStorage.removeItem("user")
                console.warn("DELETING SESSIONS")
                await account.deleteSessions()
                // navigator.sendBeacon(`/api/deleteUser`,
                //     JSON.stringify({
                //         token: user.token
                //     })
                // );
                loggedIn = true;
            } else {
                console.info("no user found")
            }
        }

        const redirectUser = () => {
            const path = window.location.pathname;
            const roomPattern = /^\/room\/[^\/]+$/; // Matches "/room/[x]"
            const genericPattern = /^\/[^\/]+$/; // Matches "/[x]"

            if (roomPattern.test(path)) {
                // If the user is on a "/room/[x]" path, no need to redirect
                console.info("User is on a valid path.");
            } else if (genericPattern.test(path) && !["/register", "/login", "/logout"].includes(path)) {
                // If the user is on a "/[x]" path, redirect to "/room/[x]"
                const newPath = path.replace(/^\/([^\/]+)$/, '/room/$1');
                router.push(process.env.NEXT_PUBLIC_HOSTNAME + newPath);
            } else {
                // If the user is on any other path, don't redirect to "/"
                // router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/");
            }
        };

        await handleLoad()

        if(!loggedIn) redirectUser();

        setLoading(false);
    }

    useEffect(() => {

        middlewareFunction()

        /* RUN ON PAGE EXIT */
        const handleUnload = async () => {
            console.info("removing cookies data")
            if(user){
                localStorage.removeItem("user")
                console.warn("DELETING SESSIONS ON EXIT")
                await account.deleteSessions()
                // navigator.sendBeacon(`/api/deleteUser`,
                //     JSON.stringify({
                //         token: user.token
                //     })
                // );
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        /* END */

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    if(loading) return <LoadingFullscreen />;

    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
};