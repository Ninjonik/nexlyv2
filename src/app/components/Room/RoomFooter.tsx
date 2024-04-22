import {Textarea} from "@/app/components/Textarea";
import React, {Dispatch, SetStateAction} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import Message from "@/app/utils/interfaces/MessageInterface";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";

interface RoomFooterProps {
    room: Room,
    setTemporaryMessage: React.Dispatch<React.SetStateAction<MessageInterface | null>>
}

export const RoomFooter = ({ room, setTemporaryMessage }: RoomFooterProps) => {

    return (
        <footer className={"bg-base-100 flex w-full p-2"}>
            <Textarea room={room} setTemporaryMessage={setTemporaryMessage} />
        </footer>
    );
};