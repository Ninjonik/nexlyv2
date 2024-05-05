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
import {FaUser} from "react-icons/fa";
import {InvitePeople} from "@/app/components/Room/InvitePeople";
import {ListUser} from "@/app/components/Room/ListUser";

interface RoomMainProps {
    room: Room;
    messagesProps: Message[];
}

export const RoomMain = ({room: roomDef, messagesProps}: RoomMainProps) => {

    const [room, setRoom] = useState<Room>(roomDef);
    const [messages, setMessages] = useState<Message[]>(messagesProps);
    const [temporaryMessage, setTemporaryMessage] = useState<MessageInterface | null>(null);
    const [inCall, setInCall] = useState<boolean>(false);
    const [usersHidden, setUsersHidden] = useState<boolean>(false);

    function handleWindowSizeChange() {
        const width = window.innerWidth;
        const isMobile = width <= 768;
        if(isMobile) setUsersHidden(true);
    }

    useEffect(() => {

        window.addEventListener('resize', handleWindowSizeChange);

        const unsubscribe = client.subscribe(`databases.${database}.collections.rooms.documents`, response => {
            if(response.events.includes(`databases.*.collections.rooms.documents.${room.$id}.update`)){
                const newRoomPayload = response.payload as Room
                console.info("UPDATED ROOM: ", newRoomPayload)
                setRoom(newRoomPayload);
            }
        });

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
            unsubscribe();
        }

    }, []);

    return (
        <>
            <RoomActionButtons room={room} inCall={inCall} setInCall={setInCall} usersHidden={usersHidden} setUsersHidden={setUsersHidden} />

            <main className={`flex flex-col row-span-12 justify-between bg-base-200 h-full ${usersHidden ? "col-span-9" : "col-span-7"}`}>

                <RoomCall inCall={inCall} setInCall={setInCall} room={room}/>

                <section
                    className={"bg-base-200 border-y-2 border-r-2 border-primary flex flex-col-reverse gap-6 p-4 overflow-y-scroll no-scrollbar h-full"}
                    id="scrollableDiv">
                    <MessageSection setMessages={setMessages} messages={messages} room={room}
                                    temporaryMessage={temporaryMessage} setTemporaryMessage={setTemporaryMessage}/>
                </section>

                <RoomFooter room={room} setTemporaryMessage={setTemporaryMessage}/>
            </main>

            <aside className={`row-span-11 bg-base-100 border-t-2 border-primary flex flex-col gap-8 p-8 transition-all ${usersHidden ? "col-span-0 row-span-0 hidden" : "col-span-2"}`}>
                <div className={"flex flex-col gap-2"}>
                    <h2 className={"font-bold text-3xl"}>{room.name}</h2>
                    <h3 className={"font-bold text-xl"}>{room.description}</h3>
                </div>

                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row justify-between items-center"}>
                        <h2 className={"font-bold text-2xl flex flex-row justify-center items-center text-center gap-2"}>{
                            <FaUser/>} Members ({room.users.length})</h2>
                        <InvitePeople roomId={room.$id}/>
                    </div>

                    <div className={"flex flex-col gap-3 max-h-96 overflow-y-scroll no-scrollbar"}>
                        {room.users.map((user, index) => (
                            <ListUser key={index} user={user}/>
                        ))}
                    </div>
                </div>

            </aside>
        </>
    );
};