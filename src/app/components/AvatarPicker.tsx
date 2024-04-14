"use client"

import { AiOutlineCloudUpload } from "react-icons/ai";
import React, {useCallback, useEffect, useState} from "react";
import {JoinRoomFormInterface} from "@/app/components/JoinRoom/JoinRoomForm";

interface AvatarPickerProps {
    form: any,
    setForm: React.Dispatch<React.SetStateAction<any>>
    inputName: string
    avatarText?: string
}

export const AvatarPicker = ({ form, setForm, inputName, avatarText = "Select your avatar" } : AvatarPickerProps) => {

    const [image, setImage] = useState<string>(process.env.NEXT_PUBLIC_HOSTNAME + "/img/defaultAvatar.jpg");

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e || !e?.target || !e?.target?.files) return;
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
        setForm((prevForm: any) => ({
            ...prevForm,
            [inputName]: file
        }));
    }, [setForm, inputName]);

    useEffect(() => {
        // Release the Object URL to prevent memory leaks
        return () => {
            URL.revokeObjectURL(image);
        };
    }, [image]);

    return (
        <label htmlFor={inputName} className={"group w-1/2 h-20"}>
            <div className={"relative"}>
                <div className={"avatar flex justify-center items-center gap-4 opacity-100 group-hover:opacity-0 transition-all ease-in-out absolute"}>
                    <span className={"text-primary"}>{avatarText}</span>
                    <div className="w-20 mask mask-squircle group-hover:opacity-50 transition-all ease-in">
                        <img src={image} />
                    </div>
                </div>
                <div className="avatar placeholder flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-all ease-in-out absolute">
                    <span className={"text-primary"}>{avatarText}</span>
                    <div className="bg-neutral text-neutral-content mask mask-squircle w-20">
                        <span className="text-3xl"><AiOutlineCloudUpload /></span>
                    </div>
                </div>
            </div>
            <input type={"file"} id={inputName} className={"hidden"} onChange={handleFileChange} accept={"image/png, image/jpeg, image/jpg, image/gif, image/webp"} />
        </label>
    );
};
