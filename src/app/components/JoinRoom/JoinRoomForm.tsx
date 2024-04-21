"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import generateRandomString from "@/app/utils/generateRandomString";
import {account} from "@/app/utils/appwrite";

export interface JoinRoomFormInterface {
    avatar: File,
    name: string,
}

export interface JoinRoomFormProps {
    roomCode: string
}

export const JoinRoomForm = ({ roomCode } : JoinRoomFormProps) => {

    const [form, setForm] = useState<JoinRoomFormInterface | undefined>()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        setLoading(true)

        /* Create a new user */
        const generatedToken =  generateRandomString();

        /* Check if the desired room exists and is open for new users */
        const res = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/checkRoom`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "roomCode": roomCode,
                }),
            }
        )
        const resJson = await res.json();
        if(resJson?.error){
            setLoading(false)
            return setError(resJson.error);
        }

        /* Room exists and is open for new users */

        try {
            await account.deleteSessions()
        } catch (e) {
            console.info("no session")
        }

        const newAnonymousSession = await account.createAnonymousSession();
        await account.updateName(form?.name || "Anonymous");
        const jwt = await account.createJWT();

        const joinRes = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/joinRoom`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "roomCode": roomCode,
                    "token": generatedToken,
                    "name": form?.name,
                    "avatar": form?.avatar,
                    "jwt": jwt
                }),
            }
        )

        const joinResJson = await joinRes.json();
        if(joinResJson?.error){
            setLoading(false)
            return setError(joinResJson.error);
        }

        localStorage.setItem("user", JSON.stringify({
            name: form?.name || "Anonymous",
            avatar: form?.avatar,
            token: generatedToken,
            $id: joinResJson.newUser.$id,
        }));

        router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode, );
        router.refresh()
        setLoading(false)
        return;


    }, [form])

    return (
        <div className={"flex flex-col gap-4"}>
            {error && (
                <div className={"text-red-500"}>{error}</div>
            )}
            <form className={"flex flex-col gap-4 w-full"} onSubmit={handleFormSubmit}>
                <Input name={"name"} label={"Nickname"} form={form?.name}
                       setForm={setForm}/>
                <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
                {loading ? (
                    <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={""}/>
                ) : (
                    <Button color={"primary"} text={"Join the room"} type={"submit"} />
                )}
            </form>
        </div>
    );
};