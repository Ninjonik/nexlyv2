"use client"

import React from 'react';
import {Loading} from "@/app/components/Loading";
import {useUserContext} from "@/app/utils/UserContext";
import {useRouter} from "next/navigation";
import {account} from "@/app/utils/appwrite";

const Logout = () => {
    const router = useRouter();
    const {user, setUser} = useUserContext();
    if(!user) return router.push("/");

    const handleUserLogout = async () => {
        localStorage.removeItem("user");
        await account.deleteSessions();
        router.push("/");
        router.refresh();
    }

    handleUserLogout();

    return <Loading />;
};

export default Logout;