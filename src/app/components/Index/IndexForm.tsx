"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {account, storage} from "@/app/utils/appwrite";
import {useRouter} from "next/navigation";
import {useUserContext} from "@/app/utils/UserContext";
import {ID} from "appwrite";
import {toast} from "react-toastify";
import isPermanentAccount from "@/app/utils/isPermanentAccount";
import deleteAppwriteSessions from "@/app/utils/deleteAppwriteSessions";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";

export interface IndexFormInterface {
    name: string,
    avatar?: File,
    roomCode: string,
    roomName?: string,
    roomDescription?: string,
    roomAvatar?: File,
}

const handleAnonymousUserCreation = async (permanentAccount: false | UserLocalStorageInterface, name: string | undefined, avatar: File | undefined): Promise<string> => {
    if(!permanentAccount){
        await deleteAppwriteSessions();
        await account.createAnonymousSession();
        await account.updateName(name || "Anonymous");

        if(avatar){
            try {
                const avatarRes = await storage.createFile(
                    "avatars",
                    ID.unique(),
                    avatar
                );
                return avatarRes.$id as string;
            } catch (e) {
                console.warn("Invalid avatar file type.");
                return "defaultAvatar";
            }
        }

        return "defaultAvatar";
    } else {
        return permanentAccount.avatar;
    }
}

export const IndexForm = () => {

    const [form, setForm] = useState<IndexFormInterface | undefined>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean | "joinRoom" | "createRoom">(false);
    const [tab, setTab] = useState<boolean>(true);
    const router = useRouter();
    const { user, getUserData } = useUserContext();

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

    const handleApiJoinRequestResponse = useCallback(async (name: string, joinRes: any, avatarValue: string, permanentAccount: false | UserLocalStorageInterface) => {
        const joinResJson = await joinRes.json();
        if(!joinResJson || !joinResJson?.roomCode){
            setLoading(false);
            setError(joinResJson.error);
            return false;
        }

        if(!permanentAccount){
            localStorage.setItem("user", JSON.stringify({
                name: name,
                avatar: avatarValue,
                $id: joinResJson.newUser.$id,
            }));
        }

        return joinResJson.roomCode;
    }, [])

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        const eventSubmitter = (e.nativeEvent as SubmitEvent).submitter?.id as "createRoom" | "joinRoom";
        if(!eventSubmitter) return setLoading(false);
        setLoading(eventSubmitter);

        const permanentAccount = await isPermanentAccount();
        let avatarValue = "defaultAvatar";

        if(eventSubmitter === "joinRoom"){
            const roomCode = form?.roomCode

            if(!roomCode) {
                setLoading(false);
                return setError("You must specify an invite code before joining a room.")
            }

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
                setLoading(false);
                return setError(resJson.error);
            }

            /* Room exists and is open for new users */

            /* Check whether user has a permanent account */
            avatarValue = await handleAnonymousUserCreation(permanentAccount, form?.name, form?.avatar);
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
                        "name": form?.name,
                        "avatar": avatarValue,
                        "jwt": jwt.jwt
                    }),
                }
            )

            await handleApiJoinRequestResponse(form?.name || "Anonymous", joinRes, avatarValue, permanentAccount);

            await getUserData();
            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
        }

        if(eventSubmitter === "createRoom"){

            avatarValue = await handleAnonymousUserCreation(permanentAccount, form?.name, form?.avatar);
            const jwt = await account.createJWT()
            
            let RoomAvatarValue = "defaultAvatar";
            if(form?.roomAvatar){
                try {
                    const RoomAvatarRes = await storage.createFile(
                        "avatars",
                        ID.unique(),
                        form.roomAvatar
                    )
                    RoomAvatarValue = RoomAvatarRes.$id;
                } catch (e) {
                    console.warn("Invalid room avatar file type.");
                }
            }

            const joinRes = await fetch(
                process.env.NEXT_PUBLIC_HOSTNAME + `/api/createRoom`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "name": form?.name,
                        "avatar": avatarValue,
                        "roomName": form?.roomName,
                        "roomDescription": form?.roomDescription,
                        "roomAvatar": RoomAvatarValue,
                        "jwt": jwt.jwt
                    }),
                }
            )

            const responseData = await handleApiJoinRequestResponse(form?.name || "Anonymous", joinRes, avatarValue, permanentAccount);
            if(!responseData) return;

            const roomCode: string = responseData
            await getUserData();
            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
        }

        setLoading(false);

    }, [form])

    return (
        <div className={"flex flex-col gap-4"}>
            {error && (
                <div className={"text-red-500"}>{error}</div>
            )}
            <form className={"flex flex-col justify-center gap-4 w-full"} onSubmit={submitForm}>

                <div role="tablist" className="tabs tabs-boxed">
                    <a role="tab" className={`tab text-primary ${tab && "tab-active"}`} onClick={() => setTab(true)}>Join a room</a>
                    <a role="tab" className={`tab text-secondary ${!tab && "tab-active"}`} onClick={() => setTab(false)}>Create a room</a>
                </div>

                <div className={"flex flex-col gap-4"}>
                    {!user?.email && (
                        <Input name={"name"} label={"Nickname"} form={form?.name}
                               setForm={setForm} color={tab ? "primary" : "secondary"} />
                    )}

                    {tab ? (
                        <>
                            <Input name={"roomCode"} label={"Room code"} form={form?.roomCode}
                                   setForm={setForm}/>
                            <Input name={"roomDescription"} label={"‎"} form
                                ={form?.roomDescription}
                                   setForm={setForm} color={"secondary"} className={"invisible"}/>
                            {!user?.email && (
                                <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
                            )}

                            {loading === "joinRoom" ? (
                                <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""}
                                        text={"Joining the room"}/>
                            ) : (
                                <Button color={"primary"} type={"submit"} name={"joinRoom"} text={"Join a room"}/>
                            )}
                        </>
                    ) : (
                        <>
                            <Input name={"roomName"} label={"Room name"} form={form?.roomName} setForm={setForm}
                                   color={"secondary"}/>
                            <Input name={"roomDescription"} label={"Room description"} form={form?.roomDescription}
                                   setForm={setForm} color={"secondary"}/>
                            <div className={"flex flex-col md:flex-row justify-evenly"}>
                                {!user?.email && (
                                    <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
                                )}
                                <AvatarPicker form={form} setForm={setForm} inputName={"roomAvatar"} color={"secondary"}
                                              avatarText={"Select room's avatar"}/>
                            </div>

                            {loading === "createRoom" ? (
                                <Button disabled={true} loading={true} color={"secondary"} type={"button"} name={""}
                                        text={"Creating a room"}/>
                            ) : (
                                <Button color={"secondary"} type={"submit"} name={"createRoom"} text={"Create a new room"}/>
                            )}
                        </>
                    )}

                </div>

            </form>
        </div>

    );
};