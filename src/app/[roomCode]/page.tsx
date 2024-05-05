import React from 'react';
import {Avatar} from "@/app/components/Avatar";
import RoomInterface from "@/app/utils/interfaces/RoomInterface";
import {FaUser} from 'react-icons/fa';
import {ListUser} from "@/app/components/Room/ListUser";
import {databases} from "@/app/utils/appwrite-server";
import {database} from "@/app/utils/appwrite";
import {redirect} from "next/navigation";
import {RoomMain} from "@/app/components/Room/RoomMain";
import {Query} from "node-appwrite";
import Message from "@/app/utils/interfaces/MessageInterface";
import {RoomActionButtons} from "@/app/components/Room/RoomActionButtons";
import getAvatar from "@/app/utils/getAvatar";
import {InvitePeople} from "@/app/components/Room/InvitePeople";

export const dynamic = 'force-dynamic'

const Room = async ({ params } : { params: {roomCode: string} }) => {

    const room = await databases.getDocument(
        database,
        "rooms",
        params.roomCode
    ) as RoomInterface
    if(!room) redirect("/404")
    const messagesQuery = await databases.listDocuments(
        database,
        "messages",
        [
            Query.equal("room", room.$id),
            Query.orderDesc("$updatedAt"),
            Query.limit(10),
        ]
    );
    const messages = messagesQuery.documents as Message[]

    return (
        <main className={"h-full w-full grid grid-cols-9 grid-rows-12 text-base-content"}>
            <header className={"col-span-7 bg-base-100 row-span-1 flex justify-between py-2 px-8"}>
                <div className={"flex flex-row justify-center items-center gap-4"}>
                    <Avatar avatar={getAvatar(room.avatar)} />
                    <div className={"flex flex-col justify-start gap-2"}>
                        <h1 className={"text-2xl font-bold"}>{room.name}</h1>
                        <h3>{room.users.length} Members</h3>
                    </div>
                </div>
                <div className={"flex justify-center items-center"}>
                    <h2 className={"text-4xl font-bold italic"}>#{room.$id}</h2>
                </div>
            </header>

            <RoomMain room={room} messagesProps={messages} />

        </main>
    );
}

export default Room;