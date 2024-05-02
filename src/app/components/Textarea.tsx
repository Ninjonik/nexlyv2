import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { FaPlus } from 'react-icons/fa';
import {AiOutlineDelete, AiOutlineFileGif, AiOutlineSmile} from "react-icons/ai";
import {Anchor} from "@/app/components/Anchor";
import TextareaAutosize from 'react-textarea-autosize';
import {account, database} from "@/app/utils/appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import Message from "@/app/utils/interfaces/MessageInterface";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import {DefaultExtensionType, defaultStyles, FileIcon} from "react-file-icon";
import Image from "next/image";
import uploadMultipleFiles from "@/app/utils/uploadMultipleFiles";
import GifPicker from "gif-picker-react";
import Tippy from "@tippyjs/react";


interface TextareaProps {
    className?: string,
    room: Room,
    setTemporaryMessage: React.Dispatch<React.SetStateAction<MessageInterface | null>>
}

export const Textarea = ({ className, room, setTemporaryMessage } : TextareaProps ) => {

    const ref = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState<string>("")
    const [attachments, setAttachments] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { user, setUser } = useUserContext()

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(() => {
    //         /* Perform emoji formatting etc. */
    //     }, 1000)
    //
    //
    //
    //
    //     return () => clearTimeout(delayDebounceFn)
    //
    // }, [text]);

    useEffect(() => {
        const keyDownHandler = (event: { key: string; shiftKey: boolean; preventDefault: () => void; }) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const message = ref?.current?.value;
                const attachmentsToSend = attachments || [];
                console.log(attachments);
                if(!message && attachmentsToSend.length < 1) return null;
                handleSubmit(message, attachmentsToSend);
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    }, [attachments]);

    const handleSubmit = useCallback(async (message: string = "", attachmentsToSend: File[] = []) => {

        setText("");
        setAttachments([]);
        if(submitting) return;

        const jwt = await account.createJWT();
        const acc = await account.get();
        console.info("USER ID: ", user?.$id);
        console.info("ACCOUNT ID: ", acc.$id);
        console.info("MESSAGE: ", message);
        console.info("ATTACHMENTS: ", attachmentsToSend);

        if(!user) return null;
        if(!message && attachmentsToSend.length < 1) return null;

        setTemporaryMessage({
            $id: "tempMessage",
            $createdAt: new Date().toString(),
            $updatedAt: new Date().toString(),
            $permissions: [],
            author: {
                ...user,
                room: room,
                $permissions: [],
                $databaseId: database,
                $collectionId: "users",
            },
            room: room,
            message: message,
            attachments: [],
            $databaseId: database,
            $collectionId: "messages",
        });

        /*
            Upload all the attachments.
        */

        let attachmentIds: string[] = [];
        if(attachmentsToSend.length > 0){
            attachmentIds = await uploadMultipleFiles(attachmentsToSend);
        }
        console.info(attachmentIds);

        const res = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "jwt": jwt,
                    "message": message,
                    "attachments": attachmentIds,
                    "roomId": room.$id
                }),
            }
        )
        const resJson = await res.json();
        if(resJson?.error || !resJson?.data){
            return setTemporaryMessage(null);
        }

        const newMessage: Message = resJson.data;

    }, [room, submitting])

    const updateAttachments = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const currentAttachmentsLength = attachments?.length || 0;
        if(currentAttachmentsLength > 5) return;

        const uploadedFiles: File[] = Array.from(e.target.files || []);
        if(!uploadedFiles) return;

        const uploadedFilesLength = uploadedFiles.length;
        if(currentAttachmentsLength + uploadedFilesLength > 5) return;

        setAttachments((prevAttachments: File[]) => [...prevAttachments, ...uploadedFiles]);
    }, [attachments])

    const removeAttachment = useCallback((index: number) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    }, [attachments]);

    const handlePaste = useCallback(async (
        event: React.ClipboardEvent<HTMLTextAreaElement>,
    ) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf("image") === 0) {
                event.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    setAttachments((prevAttachments: File[]) => [...prevAttachments, file])
                }
                return;
            }
        }
    }, []);

    return (
        <div className={"w-full flex flex-col bg-base-300 rounded-lg px-2 py-1"}>
            <ul className={"flex flex-row gap-4"}>
                {attachments?.map((attachment: File, index) => {
                    const fileExtension = attachment.name.split('.').pop()?.toLowerCase() || 'png';
                    const fileIconStyles = defaultStyles[fileExtension as DefaultExtensionType] || defaultStyles.png;

                    return (
                        <li className={"bg-base-300 border-primary border rounded-xl p-2 h-48 w-48 flex flex-col justify-between items-center relative"} key={index}>
                            <div className={"absolute right-1 top-1"}>
                                <Anchor title={"Remove attachment"} hideTitle={true} icon={<AiOutlineDelete/>} size={"2xl"}
                                        className={"rounded-full"} action={() => removeAttachment(index)}/>
                            </div>
                            <div className={"w-32 h-32 flex justify-center items-center pt-4"}>
                                {["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"].includes(attachment.type) ? (
                                    <Image
                                        className="rounded-md ease-in w-full h-full"
                                        alt={attachment.name}
                                        height={0}
                                        width={0}
                                        src={URL.createObjectURL(attachment)}
                                    />
                                ) : (
                                    <FileIcon extension={fileExtension} {...fileIconStyles} />
                                )}
                            </div>
                            <div className={"text-sm break-words text-center"}>{attachment.name}</div>
                        </li>
                    );
                })}

            </ul>
            <form className={"w-full flex justify-between"} onSubmit={(e) => e.preventDefault()}>
                <div className={"flex justify-center items-center"}>

                    <label>
                        <input type="file" className="hidden" name="file1" max={5} multiple={true} onChange={updateAttachments}/>
                        <Anchor icon={<FaPlus/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                                className={"p-2"}/>
                    </label>
                </div>
                <div className={"w-full"}>
                    <TextareaAutosize
                        className={`textarea focus:outline-none focus:border-none w-full h-full ${className} p-2 resize-none bg-base-300 max-h-96 overflow-y-scroll no-scrollbar flex items-center`}
                        cacheMeasurements
                        ref={ref}
                        value={text}
                        rows={1}
                        onPaste={handlePaste}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className={"flex justify-center items-center"}>
                    <Tippy
                        content={
                            <GifPicker
                                tenorApiKey={process.env.NEXT_PUBLIC_TENOR_KEY || "no_tenor_api_key"} onGifClick={(e: { url: string }) => handleSubmit(e.url)}
                            />
                        }
                        trigger={"click"}
                        interactive={true}
                        appendTo={document.body}
                    >
                        <a
                            title={"Open GIF picker"}
                            className={`flex justify-center items-center text-center text-2xl text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer p-2`}
                        >
                            <AiOutlineFileGif/>
                        </a>
                    </Tippy>
                    <Anchor icon={<AiOutlineSmile/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                            className={"p-2"}/>
                </div>
                <input type={"submit"} hidden/>
            </form>
        </div>
    );
};