import {Avatar} from "@/app/components/Avatar";
import React from "react";
import User from "@/app/utils/interfaces/UserInterface";
import {storage} from "@/app/utils/appwrite";

export const ListUser = async ({ user }: {user: User}) => {

    const avatar = storage.getFilePreview(
        "avatars",
        "defaultAvatar"

    )
    if(!avatar || !avatar.href) return "";

    return (
        <div className={"flex flex-row items-center gap-2"}>
            <Avatar avatar={avatar.href} />
            <h1 className={"text-2xl font-bold"}>{user.name}</h1>
        </div>
    );
};