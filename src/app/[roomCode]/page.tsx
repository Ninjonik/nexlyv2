import React from 'react';
import {Avatar} from "@/app/components/Avatar";
import RoomInterface from "@/app/utils/interfaces/RoomInterface";
import {FaPhone, FaUsers, FaArrowRight, FaUser, FaPlus} from 'react-icons/fa';
import {Anchor} from "@/app/components/Anchor";
import {ThemeSelector} from "@/app/components/ThemeSelector";
import {ListUser} from "@/app/components/Room/ListUser";
import {databases} from "@/app/utils/appwrite-server";
import {database} from "@/app/utils/appwrite";
import {redirect} from "next/navigation";
import {RoomMain} from "@/app/components/Room/RoomMain";
import {Query} from "node-appwrite";
import Message from "@/app/utils/interfaces/MessageInterface";
import LoadingRoom from "@/app/[roomCode]/loading";
import {RoomActionButtons} from "@/app/components/Room/RoomActionButtons";
import getAvatar from "@/app/utils/getAvatar";

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

            <RoomActionButtons room={room} />

            <RoomMain room={room} messagesProps={messages} />

            <aside className={"row-span-11 col-span-2 bg-base-100 border-t-2 border-primary flex flex-col gap-8 p-8"}>
                <h2 className={"font-bold text-3xl"}>{room.name}</h2>

                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row justify-between items-center"}>
                        <h2 className={"font-bold text-2xl flex flex-row justify-center items-center text-center gap-2"}>{
                            <FaUser/>} Members ({room.users.length})</h2>
                        <Anchor icon={<FaPlus/>} title={"Invite new people"} hideTitle={true} size={"3xl"}/>
                    </div>

                    <div className={"flex flex-col gap-3 max-h-96 overflow-y-scroll no-scrollbar"}>
                        {room.users.map((user, index) => (
                            <ListUser key={index} user={user}/>
                        ))}
                    </div>
                </div>

            </aside>

        </main>
    );
}

export default Room;