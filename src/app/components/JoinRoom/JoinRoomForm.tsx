"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {useState} from "react";

export interface JoinRoomFormInterface {
    avatar: File,
}

export const JoinRoomForm = () => {

    const [form, setForm] = useState<JoinRoomFormInterface | undefined>()


    return (
        <form className={"flex flex-col gap-4 w-full"}>
            <Input name={"name"} label={"Enter your nickname"}/>
            <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
            <Button color={"primary"} text={"Join the room"}/>
        </form>
    );
};