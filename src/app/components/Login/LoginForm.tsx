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

export interface LoginFormInterface {
    email: string,
    password: string,
}

export const LoginForm = () => {

    const [form, setForm] = useState<LoginFormInterface | undefined>()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { getUserData } = useUserContext();

    const submitForm = (e: SyntheticEvent) => {
        toast.promise(
            handleFormSubmit(e),
            {
                pending: 'Logging in...',
                success: 'Logged in!',
                error: 'There was an error while logging you in...'
            },
            {
                autoClose: 2000,
            }
        )
    }

    const handleFormSubmit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        setLoading(true);

        if(!form?.email || !form.password){
            setLoading(false);
            return setError("Please fill all the fields.");
        }
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
            await account.createEmailPasswordSession(email, password);
            jwt = await account.createJWT();
        } catch (e: any){
            console.info(e);
            setLoading(false)
            return setError(e.message);
        }

        /* Create user in the database collection */
        const res = await fetch(
            process.env.NEXT_PUBLIC_HOSTNAME + `/api/getAccount`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "jwt": jwt.jwt
                }),
            }
        )

        const resJson = await res.json();
        if(resJson?.error){
            setLoading(false)
            return setError(resJson.error);
        }

        await getUserData();

        localStorage.setItem("user", JSON.stringify({
            name: resJson.user.name,
            avatar: resJson.user.avatar,
            $id: resJson.user.$id,
            email: email,
        }));

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
                <Input name={"email"} label={"Email"} type={"email"} form={form?.email} required={true}
                       setForm={setForm}/>
                <Input name={"password"} label={"Password"} type={"password"} form={form?.password} required={true}
                       setForm={setForm}/>
                {loading ? (
                    <Button disabled={true} loading={true} color={"primary"} type={"button"} name={""} text={"Logging in..."}/>
                ) : (
                    <Button color={"primary"} text={"Log in"} type={"submit"} />
                )}
            </form>
        </div>
    );
};
