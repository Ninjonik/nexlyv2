import {JoinRoomForm} from "@/app/components/JoinRoom/JoinRoomForm";
import {HomeBase} from "@/app/components/HomeBase";
import {IndexForm} from "@/app/components/Index/IndexForm";
import React from "react";

export default function JoinRoom({ params } : { params: {roomCode: string} }) {

    return (
        <HomeBase>
            <JoinRoomForm roomCode={params.roomCode} />
        </HomeBase>
    );
}
