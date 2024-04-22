"use client"

import Room from "@/app/utils/interfaces/RoomInterface";
import React, {useState} from "react";
import Message from "@/app/utils/interfaces/MessageInterface";
import {MessageSection} from "@/app/components/Room/MessageSection";
import {Textarea} from "@/app/components/Textarea";
import {RoomFooter} from "@/app/components/Room/RoomFooter";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";

interface RoomMainProps {
    room: Room;
    messagesProps: Message[];
}

export const RoomMain = ({room, messagesProps}: RoomMainProps) => {

    const [messages, setMessages] = useState<Message[]>(messagesProps);
    const [temporaryMessage, setTemporaryMessage] = useState<MessageInterface | null>(null);

    return (
        <main className={"flex flex-col row-span-12 col-span-7 justify-between bg-base-200"}>
            <section
                className={"bg-base-200 border-t-2 border-primary flex flex-col-reverse gap-6 p-4 overflow-y-scroll no-scrollbar"}
                id="scrollableDiv">
                <MessageSection setMessages={setMessages} messages={messages} room={room} temporaryMessage={temporaryMessage} setTemporaryMessage={setTemporaryMessage} />
            </section>

            <RoomFooter room={room} setTemporaryMessage={setTemporaryMessage} />
        </main>
    );
};