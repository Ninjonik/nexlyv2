"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import generateRandomString from "@/app/utils/generateRandomString";
import {account, storage} from "@/app/utils/appwrite";
import {useUserContext} from "@/app/utils/UserContext";
import {ID} from "appwrite";
import fireToast from "@/app/utils/fireToast";
import {toast} from "react-toastify";

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
    const { getUserData } = useUserContext();

    const submitForm = (e: SyntheticEvent) => {
        toast.promise(
            handleFormSubmit(e),
            {
                pending: 'Joining room...',
                success: 'Room joined!',
                error: 'There was an error while joining the room...'
            },
            {
                autoClose: 2000,
            }
        )
    }

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        setLoading(true);

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

        let avatarValue = "defaultAvatar";
        if(form?.avatar){
            try {
                const avatarRes = await storage.createFile(
                    "avatars",
                    ID.unique(),
                    form.avatar
                )
                avatarValue = avatarRes.$id;
            } catch (e) {
                console.warn("Invalid avatar file type.");
                return setError("Invalid avatar file type.");
            }
        }

        const joinRes = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/joinRoom`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "roomCode": roomCode,
                    "name": form?.name,
                    "avatar": avatarValue,
                    "jwt": jwt.jwt
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
            avatar: avatarValue,
            $id: joinResJson.newUser.$id,
        }));

        await getUserData();
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
            <form className={"flex flex-col gap-4 w-full"} onSubmit={submitForm}>
                <Input name={"name"} label={"Nickname"} form={form?.name}
                       setForm={setForm}/>
                <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
                {loading ? (
                    <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={"Joining the room"}/>
                ) : (
                    <Button color={"primary"} text={"Join the room"} type={"submit"} />
                )}
            </form>
        </div>
    );
};