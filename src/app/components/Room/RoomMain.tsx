"use client"

import Room from "@/app/utils/interfaces/RoomInterface";
import React, {useEffect, useState} from "react";
import Message from "@/app/utils/interfaces/MessageInterface";
import {MessageSection} from "@/app/components/Room/MessageSection";
import {Textarea} from "@/app/components/Textarea";
import {RoomFooter} from "@/app/components/Room/RoomFooter";
import MessageInterface from "@/app/utils/interfaces/MessageInterface";
import {RoomCall} from "@/app/components/Room/RoomCall";
import {client, database} from "@/app/utils/appwrite";
import {RoomActionButtons} from "@/app/components/Room/RoomActionButtons";

interface RoomMainProps {
    room: Room;
    messagesProps: Message[];
}

export const RoomMain = ({room: roomDef, messagesProps}: RoomMainProps) => {

    const [room, setRoom] = useState<Room>(roomDef);
    const [messages, setMessages] = useState<Message[]>(messagesProps);
    const [temporaryMessage, setTemporaryMessage] = useState<MessageInterface | null>(null);
    const [inCall, setInCall] = useState<boolean>(false);

    useEffect(() => {

        const unsubscribe = client.subscribe(`databases.${database}.collections.rooms.documents`, response => {
            if(response.events.includes(`databases.*.collections.rooms.documents.${room.$id}.update`)){
                const newRoomPayload = response.payload as Room
                console.info("UPDATED ROOM: ", newRoomPayload)
                setRoom(newRoomPayload);
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <>
            <RoomActionButtons room={room} inCall={inCall} setInCall={setInCall} />

            <main className={"flex flex-col row-span-12 col-span-7 justify-between bg-base-200 h-full"}>

                <RoomCall inCall={inCall} setInCall={setInCall} room={room} />

                <section
                    className={"bg-base-200 border-y-2 border-r-2 border-primary flex flex-col-reverse gap-6 p-4 overflow-y-scroll no-scrollbar h-full"}
                    id="scrollableDiv">
                    <MessageSection setMessages={setMessages} messages={messages} room={room} temporaryMessage={temporaryMessage} setTemporaryMessage={setTemporaryMessage} />
                </section>

                <RoomFooter room={room} setTemporaryMessage={setTemporaryMessage} />
            </main>
        </>
    );
};