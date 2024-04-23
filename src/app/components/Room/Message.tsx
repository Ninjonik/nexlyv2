"use client"

import {Avatar} from "@/app/components/Avatar";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import {useEffect, useState} from "react";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";
import {storage} from "@/app/utils/appwrite";
import formatTimestampToDate from "@/app/utils/formatTimestampToDate";
import formatTimestampToTime from "@/app/utils/formatTimestampToTime";
import {useUserContext} from "@/app/utils/UserContext";
import {Loading} from "@/app/components/Loading";

interface MessageProps {
    message: MessageInterface;
    temporary?: boolean;
}

export const Message = ({ message, temporary } : MessageProps) => {
    const [own, setOwn] = useState<boolean | null>(false);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const {user, setUser} = useUserContext();

    useEffect(() => {
        if(user) {
            if(message.author.$id == user.$id) setOwn(true);
        }
        const avatar = storage.getFilePreview(
            "avatars",
            "defaultAvatar"

        )
        setAvatar(avatar.toString());
    }, [user, message]);

    if(own === null) return <Loading />;

    return (
        <div className={`flex flex-row max-w-[50%] gap-4 ${own ? "place-self-end" : "place-self-start"} ${temporary && "opacity-25"}`}>
            <Avatar className={own ? "order-2" : ""} avatar={avatar} />
            <div className={`flex flex-col w-full gap-1`}>
                <div className={"flex flex-row items-baseline text-center gap-2"}>
                    <span className={`text-2xl font-bold ${own && "order-2"}`}>{message.author.name}</span>
                    <span>{formatTimestampToDate(message.$updatedAt)} {formatTimestampToTime(message.$updatedAt)}</span>
                </div>
                <div className={`${own ? "rounded-l-lg bg-primary text-base-100" : "rounded-r-lg bg-base-300"} rounded-b-lg w-full p-1`}>
                    {message.message}
                </div>
            </div>
        </div>
    );
};