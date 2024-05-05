"use client"

import {Avatar} from "@/app/components/Avatar";
import React from "react";
import User from "@/app/utils/interfaces/UserInterface";
import {storage} from "@/app/utils/appwrite";
import getAvatar from "@/app/utils/getAvatar";

export const ListUser = ({ user }: {user: User}) => {

    const avatar = getAvatar(user.avatar);
    if(!avatar) return "";

    return (
        <div className={"flex flex-row items-center gap-2"}>
            <Avatar avatar={avatar} />
            <h1 className={"text-2xl font-bold"}>{user.name}</h1>
        </div>
    );
};