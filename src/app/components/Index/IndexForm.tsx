"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {account, database, databases} from "@/app/utils/appwrite";
import {ID, Permission, Query, Role} from "appwrite";
import {useRouter} from "next/navigation";

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
    const router = useRouter();

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();
        const eventSubmitter = (e.nativeEvent as SubmitEvent).submitter?.id;
        if(!eventSubmitter) return;
        console.info(form);
        if(!form?.name){
            return setError("You must fill in your nickname first.");
        }

        function generateRandomString(length = 36) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
            let result = '';
            // Use Date.now() to get the current timestamp in milliseconds and convert it to a base 36 string
            // This ensures the string starts with a unique timestamp part
            result += Date.now().toString(36);
            // Add a random number to the string to further increase uniqueness
            // Use Math.random().toString(36).substr(2) to get a random number in base 36
            result += Math.random().toString(36).substr(2);
            // If the combined string is not long enough, fill the rest with random characters
            while (result.length < length) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            // Trim the string to the desired length if it's longer
            return result.substr(0, length);
        }

        if(eventSubmitter === "joinRoom"){
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
                return setError(resJson.error);
            }

            /* Room exists and is open for new users */

            /* Create a new user */
            const generatedToken =  generateRandomString();
            localStorage.setItem("userToken", generatedToken);

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
                        "avatar": form?.avatar
                    }),
                }
            )

            const joinResJson = await joinRes.json();
            if(joinResJson?.error){
                return setError(joinResJson.error);
            }

            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
            return;
        }

        if(eventSubmitter === "createRoom"){
            // Function to generate a unique room code
            const generatedToken =  generateRandomString();
            localStorage.setItem("userToken", generatedToken);

            const joinRes = await fetch(
                process.env.NEXT_PUBLIC_HOSTNAME + `/api/createRoom`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "token": generatedToken,
                        "name": form?.name,
                        "avatar": form?.avatar,
                        "roomName": form?.roomName,
                        "roomDescription": form?.roomDescription,
                        "roomAvatar": form?.roomAvatar
                    }),
                }
            )

            const joinResJson = await joinRes.json();
            if(!joinResJson || !joinResJson?.roomCode){
                return setError(joinResJson.error);
            }

            const roomCode: string = joinResJson.roomCode
            router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/" + roomCode);
            return;
        }



    }, [form])

    return (
        <div className={"flex flex-col gap-4"}>
            {error && (
                <div className={"text-red-500"}>{error}</div>
            )}
            <form className={"flex flex-row justify-center gap-4 w-full"} onSubmit={handleFormSubmit}>
                <div className={"flex flex-col gap-4"}>
                    <Input name={"name"} label={"Enter your nickname"} required={true} form={form?.name}
                           setForm={setForm}/>
                    <Input name={"roomCode"} label={"Room code"} form={form?.roomCode}
                           setForm={setForm}/>
                    <AvatarPicker form={form} setForm={setForm} inputName={"avatar"}/>
                    <Button color={"primary"} type={"submit"} name={"joinRoom"} text={"Join the room"}/>
                </div>
                <div className={"divider"}/>
                <div className={"flex flex-col gap-4"}>
                    <Input name={"roomName"} label={"Enter your room name"} form={form?.roomName} setForm={setForm}/>
                    <Input name={"roomDescription"} label={"Enter your room description"} form={form?.roomDescription} setForm={setForm}/>
                    <AvatarPicker form={form} setForm={setForm} inputName={"roomAvatar"}
                                  avatarText={"Select group avatar"}/>
                    <Button color={"primary"} type={"submit"} name={"createRoom"} text={"Create a new room"}/>
                </div>
            </form>
        </div>

    );
};