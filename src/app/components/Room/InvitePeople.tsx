"use client"

import {FaPlus} from "react-icons/fa";
import {Anchor} from "@/app/components/Anchor";
import React, {useState} from "react";
import {Modal} from "@/app/components/Modal";

interface InvitePeopleProps {
    roomId: string,
}

export const InvitePeople = ({roomId}: InvitePeopleProps) => {

    const [modalShown, setModalShown] = useState<boolean>(false);

    return (
        <>
            <Modal title={"Invite people to the room"} state={modalShown} setState={setModalShown}>
                <div className={"flex flex-row gap-2"}>
                    <h3 className={"font-bold text-primary"}>Invite link:</h3>
                    <a className={"text-secondary hover:text-primary transition-all ease-in"} href={process.env.NEXT_PUBLIC_HOSTNAME + "/room/" + roomId} target={"_blank"}>{process.env.NEXT_PUBLIC_HOSTNAME + "/room/" + roomId}</a>
                </div>
            </Modal>
            <Anchor icon={<FaPlus/>} title={"Invite new people"} hideTitle={true} action={() => setModalShown(true)} size={"3xl"}/>
        </>
    );
};