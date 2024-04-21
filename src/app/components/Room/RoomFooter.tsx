import {Textarea} from "@/app/components/Textarea";
import React, {Dispatch, SetStateAction} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import Message from "@/app/utils/interfaces/MessageInterface";

interface RoomFooterProps {
    room: Room,
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>
}

export const RoomFooter = ({ room, messages, setMessages }: RoomFooterProps) => {

    return (
        <footer className={"bg-base-100 flex w-full p-2"}>
            <Textarea room={room} setMessages={setMessages} />
        </footer>
    );
};