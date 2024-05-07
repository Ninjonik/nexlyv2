"use client"

import {Anchor} from "@/app/components/Anchor";
import {FaArrowRight, FaPhone, FaUsers} from "react-icons/fa";
import {ThemeSelector} from "@/app/components/ThemeSelector";
import React, {SetStateAction, useCallback, useState} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import {account} from "@/app/utils/appwrite";
import { ImPhoneHangUp } from "react-icons/im";

interface RoomActionButtonsProps {
    room: Room,
    inCall: boolean,
    setInCall: React.Dispatch<SetStateAction<boolean>>,
    usersHidden: boolean,
    setUsersHidden: React.Dispatch<SetStateAction<boolean>>,
}

export const RoomActionButtons = ({ room, inCall, setInCall, usersHidden, setUsersHidden } : RoomActionButtonsProps) => {

    const { user } = useUserContext();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleCallButton = useCallback(async () => {

        if(inCall) return setInCall(false);

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

    }, [user?.name, room.$id, inCall])

    if(!user) return "";

    return (
        <aside className={"col-span-2 row-span-1 bg-base-100 flex justify-end py-2 pr-8"}>
            <div className={"flex flex-row justify-end gap-4"}>
                <button className="lg:hidden text-primary hover:text-secondary focus:text-secondary"
                        onClick={() => setShowDropdown(!showDropdown)}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showDropdown ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        )}
                    </svg>
                </button>

                {/*TODO: IMPLEMENT CHANGING ICONS BASED OFF WHETHER IN CALL OR NO*/}
                <div className={`${showDropdown ? "" : "hidden"} -z-25 flex flex-col p-2 lg:p-0 mr-16 absolute bg-base-300 rounded-xl lg:rounded-none lg:bg-transparent lg:static lg:flex-row justify-end gap-4`}>
                    <Anchor title={"Call"} hideTitle={true} icon={inCall ? <ImPhoneHangUp /> : <FaPhone/>} action={handleCallButton}/>
                    <Anchor title={"Hide sidebar"} hideTitle={true} icon={<FaUsers/>}
                            action={() => setUsersHidden(!usersHidden)}/>
                    <Anchor title={"Leave the room"} hideTitle={true} icon={<FaArrowRight/>}/>
                    <ThemeSelector/>
                </div>
            </div>
        </aside>

    );
};