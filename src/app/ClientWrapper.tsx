"use client"

import {useEffect} from "react";

export const ClientWrapper = ({children} : {children: React.ReactNode}) => {

    useEffect(() => {

        /* RUN ON PAGE EXIT */
        const handleUnload = () => {
            console.log("a hello")
            const userToken = localStorage.getItem("userToken")
            if(userToken){
                localStorage.removeItem("userToken")
                navigator.sendBeacon(`/api/deleteUser`,
                    JSON.stringify({
                        token: userToken
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