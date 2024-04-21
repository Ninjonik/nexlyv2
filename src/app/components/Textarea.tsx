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


interface TextareaProps {
    className?: string,
    room: Room,
    setMessages: Dispatch<SetStateAction<Message[]>>
}

export const Textarea = ({ className, room, setMessages } : TextareaProps ) => {

    const ref = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState<string>("")
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

        const jwt = await account.createJWT()
        const acc = await account.get()
        console.info("USER ID: ", user?.$id)
        console.info("ACCOUNT ID: ", acc.$id)
        console.info("MESSAGE: ", message)
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
            return
        }

        const newMessage: Message = resJson.data
        setMessages((prevMessages) => [newMessage, ...prevMessages])
        setText("")

        console.info(newMessage)
    }, [room])

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