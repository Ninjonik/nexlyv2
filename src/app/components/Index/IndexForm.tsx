"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {account} from "@/app/utils/appwrite";
import {useRouter} from "next/navigation";
import generateRandomString from "@/app/utils/generateRandomString";
import {useUserContext} from "@/app/utils/UserContext";

export interface IndexFormInterface {
    name: string,
    avatar?: File,
    roomCode: string,
    roomName?: string,
    roomDescription?: string,
    roomAvatar?: File,
}

export const IndexForm = () => {

    const [form, setForm] = useState<IndexFormInterface | undefined>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [joinLoading, setJoinLoading] = useState<boolean>(false);
    const router = useRouter();
    const { getUserData } = useUserContext();

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        const eventSubmitter = (e.nativeEvent as SubmitEvent).submitter?.id;
        if(!eventSubmitter) return setLoading(false);

        if(eventSubmitter === "joinRoom"){
            setJoinLoading(true);
            const roomCode = form?.roomCode
            if(!roomCode) return setError("You must specify an invite code before joining a room.")
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
                setJoinLoading(false);
                return setError(resJson.error);
            }

            /* Room exists and is open for new users */

            try {
                await account.deleteSessions()
            } catch (e) {
                console.info("no session")
            }

            const newAnonymousSession = await account.createAnonymousSession()
            await account.updateName(form?.name || "Anonymous")
            const jwt = await account.createJWT()

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
                        "avatar": form?.avatar,
                        "jwt": jwt
                    }),
                }
            )

            const joinResJson = await joinRes.json();
            if(joinResJson?.error){
                setJoinLoading(false);
                return setError(joinResJson.error);
            }

            localStorage.setItem("user", JSON.stringify({
                name: form?.name || "Anonymous",
                avatar: form?.avatar,
                $id: joinResJson.newUser.$id,
            }));

            await getUserData();
            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
            return setJoinLoading(false);
        }

        if(eventSubmitter === "createRoom"){

            setLoading(true);

            try {
                await account.deleteSessions()
            } catch (e) {
                console.info("no session")
            }

            const newAnonymousSession = await account.createAnonymousSession()
            await account.updateName(form?.name || "Anonymous")
            const jwt = await account.createJWT();

            const joinRes = await fetch(
                process.env.NEXT_PUBLIC_HOSTNAME + `/api/createRoom`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "name": form?.name,
                        "avatar": form?.avatar,
                        "roomName": form?.roomName,
                        "roomDescription": form?.roomDescription,
                        "roomAvatar": form?.roomAvatar,
                        "jwt": jwt
                    }),
                }
            )

            const joinResJson = await joinRes.json();
            if(!joinResJson || !joinResJson?.roomCode){
                setLoading(false);
                return setError(joinResJson.error);
            }

            localStorage.setItem("user", JSON.stringify({
                name: form?.name || "Anonymous",
                avatar: form?.avatar,
                $id: joinResJson.newUser.$id,
            }));

            const roomCode: string = joinResJson.roomCode
            await getUserData();
            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
            return setLoading(false);
        }

        setLoading(false);
        setJoinLoading(false);

    }, [form])

    return (
        <div className={"flex flex-col gap-4"}>
            {error && (
                <div className={"text-red-500"}>{error}</div>
            )}
            <form className={"flex flex-row justify-center gap-4 w-full"} onSubmit={handleFormSubmit}>
                <div className={"flex flex-col gap-4"}>
                    <Input name={"name"} label={"Nickname"} form={form?.name}
                           setForm={setForm}/>
                    <Input name={"roomCode"} label={"Room code"} form={form?.roomCode}
                           setForm={setForm}/>
                    <AvatarPicker form={form} setForm={setForm} inputName={"avatar"}/>

                    {joinLoading ? (
                        <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={"Joining the room"}/>
                    ) : (
                        <Button color={"primary"} type={"submit"} name={"joinRoom"} text={"Join the room"}/>
                    )}
                </div>
                <div className={"divider"}/>
                <div className={"flex flex-col gap-4"}>
                    <Input name={"roomName"} label={"Room name"} form={form?.roomName} setForm={setForm}/>
                    <Input name={"roomDescription"} label={"Room description"} form={form?.roomDescription} setForm={setForm}/>
                    <AvatarPicker form={form} setForm={setForm} inputName={"roomAvatar"}
                                  avatarText={"Select group avatar"}/>
                    {loading ? (
                        <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={"Creating a room"}/>
                    ) : (
                        <Button color={"primary"} type={"submit"} name={"createRoom"} text={"Create a new room"}/>
                    )}
                </div>
            </form>
        </div>

    );
};