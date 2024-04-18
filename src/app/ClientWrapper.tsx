"use client"

import React, {useEffect, useState} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {LoadingFullscreen} from "@/app/components/LoadingFullscreen";
import {useRouter} from "next/navigation";
import {UserContextProvider, useUserContext} from "@/app/utils/UserContext";
import {account} from "@/app/utils/appwrite";

export const ClientWrapper = ({children} : {children: React.ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(true);
    const {user, setUser} = useUserContext();
    const router = useRouter();

    useEffect(() => {

        let loggedIn = false;

        /* Runs on initial page load */
        const handleLoad = async () => {
            if(user){
                localStorage.removeItem("user")
                await account.deleteSessions()
                navigator.sendBeacon(`/api/deleteUser`,
                    JSON.stringify({
                        token: user.token
                    })
                );
                loggedIn = true;
            } else {
                console.log("no user found")
            }
        }

        const redirectUser = () => {
            const path = window.location.pathname;
            const roomPattern = /^\/room\/[^\/]+$/; // Matches "/room/[x]"
            const genericPattern = /^\/[^\/]+$/; // Matches "/[x]"

            if (roomPattern.test(path)) {
                // If the user is on a "/room/[x]" path, no need to redirect
                console.log("User is on a valid path.");
            } else if (genericPattern.test(path)) {
                // If the user is on a "/[x]" path, redirect to "/room/[x]"
                const newPath = path.replace(/^\/([^\/]+)$/, '/room/$1');
                router.push(process.env.NEXT_PUBLIC_HOSTNAME + newPath);
            } else {
                // If the user is on any other path, redirect to "/"
                router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/");
            }
        };

        if(!loggedIn) redirectUser();

        setLoading(false);

        handleLoad()

        /* RUN ON PAGE EXIT */
        const handleUnload = async () => {
            console.log("removing cookies data")
            if(user){
                localStorage.removeItem("user")
                await account.deleteSessions()
                navigator.sendBeacon(`/api/deleteUser`,
                    JSON.stringify({
                        token: user.token
                    })
                );
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        /* END */

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [user]);

    if(loading) return <LoadingFullscreen />;

    return (
        <>
            {children}
        </>
    );
};