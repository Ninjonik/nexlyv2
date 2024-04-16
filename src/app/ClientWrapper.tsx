"use client"

import React, {useEffect, useState} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {LoadingFullscreen} from "@/app/components/LoadingFullscreen";
import {useRouter} from "next/navigation";

export const ClientWrapper = ({children} : {children: React.ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {

        let loggedIn = false;

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

    if(loading) return <LoadingFullscreen />;

    return (
        <>
            {children}
        </>
    );
};