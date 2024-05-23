"use client"

import {Input} from "@/app/components/Input";
import {AvatarPicker} from "@/app/components/AvatarPicker";
import {Button} from "@/app/components/Button";
import React, {SyntheticEvent, useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import {account, storage} from "@/app/utils/appwrite";
import {useUserContext} from "@/app/utils/UserContext";
import {ID} from "appwrite";
import {toast} from "react-toastify";

export interface RegisterFormInterface {
    avatar: File,
    name: string,
    email: string,
    password: string,
}

export const RegisterForm = () => {

    const [form, setForm] = useState<RegisterFormInterface | undefined>()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { getUserData } = useUserContext();

    const submitForm = (e: SyntheticEvent) => {
        toast.promise(
            handleFormSubmit(e),
            {
                pending: 'Creating account...',
                success: 'Account created!',
                error: 'There was an error while creating an account...'
            },
            {
                autoClose: 2000,
            }
        )
    }

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        setLoading(true);

        if(!form?.name || !form?.email || !form.password){
            setLoading(false);
            return setError("Please fill all the fields.");
        }
        const name = form?.name
        const email = form?.email
        const password = form?.password

        try {
            await account.deleteSessions();
        } catch (e) {
            console.info("no session");
        }

        let jwt: any = "";
        let newAccount;

        try {
            newAccount = await account.create(
                ID.unique(),
                email,
                password,
                name
            )
            await account.createEmailPasswordSession(email, password);
            jwt = await account.createJWT();
        } catch (e: any){
            console.info(e);
            setLoading(false)
            return setError(e.message);
        }

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

        /* Create user in the database collection */
        const res = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/createAccount`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": name,
                    "avatar": avatarValue,
                    "jwt": jwt.jwt
                }),
            }
        )

        const resJson = await res.json();
        if(resJson?.error){
            setLoading(false)
            return setError(resJson.error);
        }

        localStorage.setItem("user", JSON.stringify({
            name: form?.name || "Anonymous",
            avatar: avatarValue,
            $id: newAccount.$id,
            email: newAccount.email,
        }));

        await getUserData();

        router.push(process.env.NEXT_PUBLIC_HOSTNAME + "/");
        router.refresh()

        return setLoading(false);

    }, [form, getUserData, router])

    return (
        <div className={"flex flex-col gap-4"}>
            {error && (
                <div className={"text-red-500"}>{error}</div>
            )}
            <form className={"flex flex-col gap-4 w-full"} onSubmit={submitForm}>
                <Input name={"name"} label={"Nickname"} form={form?.name} required={true}
                       setForm={setForm}/>
                <Input name={"email"} label={"Email"} type={"email"} form={form?.email} required={true}
                       setForm={setForm}/>
                <Input name={"password"} label={"Password"} type={"password"} form={form?.password} required={true}
                       setForm={setForm}/>
                <AvatarPicker form={form} setForm={setForm} inputName={"avatar"} />
                {loading ? (
                    <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={"Creating account..."}/>
                ) : (
                    <Button color={"primary"} text={"Create an account"} type={"submit"} />
                )}
            </form>
        </div>
    );
};
