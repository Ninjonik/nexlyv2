"use client"

import {Avatar} from "@/app/components/Avatar";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import React, {useEffect, useState} from "react";
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

interface MessageProps {
    message: MessageInterface;
    temporary?: boolean;
}

export const Message = ({ message, temporary } : MessageProps) => {
    const [own, setOwn] = useState<boolean | null>(false);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const {user, setUser} = useUserContext();
    const [attachmentsData, setAttachmentsData] = useState<getFileDataResult[]>([]);

    useEffect(() => {
        if(user) {
            if(message.author.$id == user.$id) setOwn(true);
        }
    }, [user, message.author.$id]);

    useEffect(() => {
        setAvatar(getAvatar(message.author.avatar));
    }, [message.author.avatar]);

    useEffect(() => {
        const fetchAttachmentsData = async () => {
            const attachmentsData = await Promise.all(message.attachments.map(async (attachmentId: string) => {
                const { preview, file, extension } = await getFileData("attachments", attachmentId);
                if (!preview || !file || !extension) return null;
                return { preview, file, extension };
            }));
            setAttachmentsData(attachmentsData.filter(Boolean) as getFileDataResult[]);
        };


        fetchAttachmentsData();
    }, [message.attachments]);

    if(own === null) return <Loading />;

    let validImageUrl = false;
    if(message?.message) validImageUrl = isValidImageUrl(message.message);


    return (
        <div className={`flex flex-row max-w-[50%] overflow-y-hidden gap-4 ${own ? "place-self-end" : "place-self-start"} ${temporary && "opacity-25"}`}>
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
                                        className="rounded-md ease-in object-fit"
                                        alt={"Imported message image"}
                                        src={message.message}
                                    />
                                </PhotoView>
                        </div>
                    ) : (
                        <div
                            className={`${own ? "rounded-l-lg bg-primary text-base-100" : "rounded-r-lg bg-base-300"} rounded-b-lg w-full p-1 whitespace-pre-line`}>
                            <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>{message.message}</Markdown>
                        </div>
                ))}
                {attachmentsData.length > 0 && (
                    <div className={"flex flex-col gap-2"}>
                        {attachmentsData.map(({ preview, file, extension }, index) => (
                            <div key={index} className={"max-h-96 max-w-96 relative pr-16"}>
                                {preview && file && extension && (
                                    <>
                                        {["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"].includes(file.mimeType) ? (
                                                <PhotoView key={index} src={preview}>
                                                    <img
                                                        className="rounded-md ease-in object-fit"
                                                        alt={file.name}
                                                        src={preview}
                                                    />
                                                    </PhotoView>
                                            /* TODO: Make it so the photoview arrows will actually work */
                                            /* TODO: Fix it so the FileIcon doesnt get stuck inside of a tall image above */
                                        ) : (
                                            <FileIcon extension={extension} {...(defaultStyles[extension as DefaultExtensionType] || defaultStyles.png)} />
                                        )}
                                        <div className={"bottom-0 right-0 absolute"}>
                                            <Anchor title={"Download the file"} hideTitle={true} icon={<AiOutlineDownload/>} href={getFileDownload("attachments", file?.$id)} download={true}/>
                                        </div>
                                    </>

                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};