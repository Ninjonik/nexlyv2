"use client"

import React, {ChangeEvent, useEffect, useRef} from "react";
import { FaPlus } from 'react-icons/fa';
import { AiOutlineFileGif, AiOutlineSmile } from "react-icons/ai";
import {Anchor} from "@/app/components/Anchor";
import TextareaAutosize from 'react-textarea-autosize';


interface TextareaProps {
    className?: string
}

export const Textarea = ({ className } : TextareaProps ) => {

    const ref = useRef<HTMLTextAreaElement>(null);

    return (
        <div className={"w-full flex justify-between bg-base-300 rounded-lg px-2 py-1"}>
            <div className={"flex justify-center items-center"}>
                <Anchor icon={<FaPlus/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
            </div>
            <div className={"w-full"}>
                <TextareaAutosize
                    className={`textarea focus:outline-none focus:border-none w-full h-full ${className} p-2 resize-none bg-base-300 max-h-96 overflow-y-scroll`}
                    cacheMeasurements
                    ref={ref}
                />
            </div>
            <div className={"flex justify-center items-center"}>
                <Anchor icon={<AiOutlineFileGif/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
                <Anchor icon={<AiOutlineSmile/>} title={"Add attachment"} hideTitle={true} size={"2xl"}
                        className={"p-2"}/>
            </div>
        </div>
    );
};