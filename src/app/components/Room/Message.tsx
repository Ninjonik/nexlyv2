"use client"

import {Avatar} from "@/app/components/Avatar";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import {useEffect, useState} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {storage} from "@/app/utils/appwrite";
import formatTimestampToDate from "@/app/utils/formatTimestampToDate";
import formatTimestampToTime from "@/app/utils/formatTimestampToTime";

interface MessageProps {
    message: MessageInterface;
}

export const Message = ({ message } : MessageProps) => {
    const [own, setOwn] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const user = localStorage.getItem("user")

    useEffect(() => {
        if(user) {
            const parsedUser = JSON.parse(user) as UserLocalStorageInterface;
            if(message.author.$id == parsedUser.$id) setOwn(false);
        }
        const avatar = storage.getFilePreview(
            "avatars",
            "defaultAvatar"

        )
        setAvatar(avatar.toString());
    }, []);

    return (
        <div className={`flex flex-row max-w-[50%] gap-4 ${own ? "place-self-start" : "place-self-end"}`}>
            <Avatar className={own ? "" : "order-2"} avatar={avatar} />
            <div className={`flex flex-col w-full gap-1`}>
                <div className={"flex flex-row items-baseline text-center gap-2"}>
                    <span className={`text-2xl font-bold ${!own && "order-2"}`}>{message.author.name}</span>
                    <span>{formatTimestampToDate(message.$updatedAt)} {formatTimestampToTime(message.$updatedAt)}</span>
                </div>
                <div className={`${own ? "rounded-r-lg" : "rounded-l-lg"} rounded-b-lg bg-base-300 w-full p-1`}>
                    {message.message}
                </div>
            </div>
        </div>
    );
};