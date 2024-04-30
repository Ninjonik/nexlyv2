import React from "react";
import Image from "next/image";
import Link from "next/link";

export const HomeBase = ({ children } : {children: React.ReactNode}) => {
    return (

        <main className={"w-full h-full flex flex-col justify-center items-center"}>
            <div className={"h-screen w-screen absolute bg-red-500"}>
                <img src={"/backgroundDark.svg"} alt={"Background image"} className={"w-full h-full object-cover"} />
            </div>
            <div className={"max-h-4/5 w-1/3 bg-base-100 rounded-xl flex flex-col items-center text-center p-8 gap-8 z-50"}>
                <div className={"flex flex-col gap-4 text-center justify-center items-center"}>
                    <Link href="/"><Image src={"/img/nexly.png"} width={150} height={150} alt={"Nexly logo"} /></Link>
                    <h1 className={"text-5xl font-bold"}>Nexly</h1>
                    <h2 className={"text-2xl"}>Welcome to <b>Nexly</b>!</h2>
                    <h3 className={"text-sm"}>Nexly is the ultimate combination of safe, private and easy-to-use
                        one-time
                        realtime chat-messaging and video-calling application.</h3>
                </div>
                <div className={"flex flex-col gap-4 justify-evenly w-full h-full"}>
                    {children}
                </div>
            </div>
        </main>
)
    ;
};