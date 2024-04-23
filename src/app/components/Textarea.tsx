import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import { FaPlus } from 'react-icons/fa';
import { AiOutlineFileGif, AiOutlineSmile } from "react-icons/ai";
import {Anchor} from "@/app/components/Anchor";
import TextareaAutosize from 'react-textarea-autosize';
import {account, database, databases} from "@/app/utils/appwrite";
import {ID, Permission, Role} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import User from "@/app/utils/interfaces/UserInterface";
import Message from "@/app/utils/interfaces/MessageInterface";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";


interface TextareaProps {
    className?: string,
    room: Room,
    setTemporaryMessage: React.Dispatch<React.SetStateAction<MessageInterface | null>>
}

export const Textarea = ({ className, room, setTemporaryMessage } : TextareaProps ) => {

    const ref = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState<string>("")
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
                const message = ref?.current?.value
                if(!message) return
                handleSubmit(message);
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => document.removeEventListener('keydown', keyDownHandler);
    }, []);

    const handleSubmit = useCallback(async (message: string) => {

        setText("");
        if(submitting) return;

        const jwt = await account.createJWT()
        const acc = await account.get()
        console.info("USER ID: ", user?.$id)
        console.info("ACCOUNT ID: ", acc.$id)
        console.info("MESSAGE: ", message)

        if(!user) return null

        setTemporaryMessage({
            $id: "tempMessage",
            $createdAt: new Date().toString(),
            $updatedAt: new Date().toString(),
            $permissions: [],
            author: {
                ...user,
                $permissions: [],
                $databaseId: database,
                $collectionId: "users",
            },
            room: room,
            message: message,
            attachments: [], // TODO: make the attachments work finally ffs
            $databaseId: database,
            $collectionId: "messages",
        });

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
                    "attachments": [],
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

    return (
        <form className={"w-full flex justify-between bg-base-300 rounded-lg px-2 py-1"} onSubmit={(e) => e.preventDefault()}>
            <div className={"flex justify-center items-center"}>
                <Anchor icon={<FaPlus/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
            </div>
            <div className={"w-full"}>
                <TextareaAutosize
                    className={`textarea focus:outline-none focus:border-none w-full h-full ${className} p-2 resize-none bg-base-300 max-h-96 overflow-y-scroll no-scrollbar flex items-center`}
                    cacheMeasurements
                    ref={ref}
                    value={text}
                    rows={1}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className={"flex justify-center items-center"}>
                <Anchor icon={<AiOutlineFileGif/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
                <Anchor icon={<AiOutlineSmile/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
            </div>
            <input type={"submit"} hidden />
        </form>
    );
};