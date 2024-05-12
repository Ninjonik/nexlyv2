"use client"

import {Avatar} from "@/app/components/Avatar";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import React, {useEffect, useMemo, useState} from "react";
import formatTimestampToDate from "@/app/utils/formatTimestampToDate";
import formatTimestampToTime from "@/app/utils/formatTimestampToTime";
import {useUserContext} from "@/app/utils/UserContext";
import {Loading} from "@/app/components/Loading";
import getAvatar from "@/app/utils/getAvatar";
import getFileData, {getFileDataResult} from "@/app/utils/getFileData";
import {DefaultExtensionType, defaultStyles, FileIcon} from "react-file-icon";;
import {Anchor} from "@/app/components/Anchor";
import {AiOutlineDownload} from "react-icons/ai";
import getFileDownload from "@/app/utils/getFileDownloadLink";
import {PhotoView} from "react-photo-view";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {isValidImageUrl} from "@/app/utils/isValidImageUrl";
import rehypeHighlight from "rehype-highlight";
import Twemoji from 'react-twemoji';
import {AttachmentList} from "@/app/components/Room/AttachmentList";

interface MessageProps {
    message: MessageInterface;
    temporary?: boolean;
}

export const Message = ({ message, temporary } : MessageProps) => {
    const [own, setOwn] = useState<boolean | null>(false);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const {user, setUser} = useUserContext();
    const [attachmentsData, setAttachmentsData] = useState<getFileDataResult[]>([]);

    let i = 0;

    const fetchAttachmentsData = useMemo(() => {
        return async () => {
            const attachmentsData = await Promise.all(message.attachments.map(async (attachmentId: string) => {
                const { preview, file, extension } = await getFileData("attachments", attachmentId);
                if (!preview ||!file ||!extension) return null;
                return { preview, file, extension };
            }));
            setAttachmentsData(attachmentsData.filter(Boolean) as getFileDataResult[]);
        };
    }, [message.attachments]);

    useEffect(() => {
        if(user) {
            if(message.author.$id === user.$id){
                setOwn(true);
            } else {
                setOwn(false);
            }
        }
    }, [user, message.author.$id]);

    useEffect(() => {
        setAvatar(getAvatar(message.author.avatar));
    }, [message.author.avatar]);

    useEffect(() => {
        fetchAttachmentsData();
    }, [message.attachments]);

    if(own === null) return <Loading />;

    let validImageUrl = false;
    if(message?.message) validImageUrl = isValidImageUrl(message.message);

    return (
        <div className={`flex flex-row overflow-hidden max-w-full lg:max-w-[50%] overflow-y-hidden gap-4 ${own ? "place-self-end" : "place-self-start"} ${temporary && "opacity-25"}`}>
            <Avatar className={own ? "order-2" : ""} avatar={avatar} />
            <div className={`flex flex-col w-full gap-1`}>
                <div className={"flex flex-row items-baseline text-center gap-2"}>
                    <span className={`text-2xl font-bold ${own && "order-2"}`}>{message.author.name}</span>
                    <span>{formatTimestampToDate(message.$updatedAt)} {formatTimestampToTime(message.$updatedAt)}</span>
                </div>

                {message.message && (
                    validImageUrl ? (
                        <div>
                                <PhotoView src={message.message}>
                                    <img
                                        className={`rounded-b-lg ease-in object-fit ${own ? "rounded-l-md bg-primary text-base-100" : "rounded-r-md bg-base-300 text-left"}`}
                                        alt={"Imported message image"}
                                        src={message.message}
                                    />
                                </PhotoView>
                        </div>
                    ) : (
                        <div
                            className={`${own ? "rounded-l-lg bg-primary text-base-100" : "rounded-r-lg bg-base-300 text-left"} rounded-b-lg w-full p-1 whitespace-pre-line`}>
                            <Twemoji options={{ className: 'twemoji' }}><Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>{message.message}</Markdown></Twemoji>
                        </div>
                ))}
                <MemoizedAttachmentList attachmentsData={attachmentsData} own={own} />
            </div>
        </div>
    );
};

const MemoizedAttachmentList = React.memo(AttachmentList);