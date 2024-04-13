import {Avatar} from "@/app/components/Avatar";
import React from "react";

export const ListUser = () => {
    return (
        <div className={"flex flex-row items-center gap-2"}>
            <Avatar/>
            <h1 className={"text-2xl font-bold"}>Chinese</h1>
        </div>
    );
};