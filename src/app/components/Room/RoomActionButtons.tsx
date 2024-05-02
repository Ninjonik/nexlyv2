"use client"

import {Anchor} from "@/app/components/Anchor";
import {FaArrowRight, FaPhone, FaUsers} from "react-icons/fa";
import {ThemeSelector} from "@/app/components/ThemeSelector";
import React, {SetStateAction, useCallback} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import {account} from "@/app/utils/appwrite";

interface RoomActionButtonsProps {
    room: Room,
    inCall: boolean,
    setInCall: React.Dispatch<SetStateAction<boolean>>,
}

export const RoomActionButtons = ({ room, inCall, setInCall } : RoomActionButtonsProps) => {

    const { user } = useUserContext();

    const startACall = useCallback(async () => {

        try {
            await account.get();
            const jwt = await account.createJWT();

            const callRes = await fetch(
                process.env.NEXT_PUBLIC_HOSTNAME + `/api/startCall`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "roomId": room.$id,
                        "jwt": jwt
                    }),
                }
            )

            const joinResJson = await callRes.json();
            if(joinResJson?.error){
                console.error(joinResJson.error);
            }
        } catch (e) {
            console.error(e);
        }

    }, [user?.name, room.$id])

    if(!user) return "";

    return (
        <aside
            className={"col-span-2 row-span-1 bg-base-100 flex justify-end py-2 pr-8"}>
            <div className={"flex flex-row justify-end gap-4"}>
                {/*TODO: IMPLEMENT CHANGING ICONS BASED OFF WHETHER IN CALL OR NO*/}
                <Anchor title={"Call"} hideTitle={true} icon={<FaPhone/>} action={startACall}/>
                <Anchor title={"Hide sidebar"} hideTitle={true} icon={<FaUsers/>}/>
                <Anchor title={"Leave the room"} hideTitle={true} icon={<FaArrowRight/>}/>
                <ThemeSelector/>
            </div>
        </aside>
    );
};