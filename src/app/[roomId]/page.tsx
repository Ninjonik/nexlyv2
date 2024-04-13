import React from 'react';
import {Avatar} from "@/app/components/Avatar";
import {FaPhone, FaUsers, FaArrowRight, FaUser, FaPlus} from 'react-icons/fa';
import {Anchor} from "@/app/components/Anchor";
import {Textarea} from "@/app/components/Textarea";
import {ThemeSelector} from "@/app/components/ThemeSelector";
import {ListUser} from "@/app/components/Room/ListUser";
import {Message} from "@/app/components/Room/Message";

const Room = () => {
    return (
        <main className={"h-full w-full grid grid-cols-9 grid-rows-12 text-base-content"}>
            <header className={"col-span-7 bg-base-100 row-span-1 flex justify-between py-2 px-8"}>
                <div className={"flex flex-row justify-center items-center gap-2"}>
                    <Avatar />
                    <div className={"flex flex-col justify-start"}>
                        <h1 className={"text-2xl font-bold"}>Room for Poggers</h1>
                        <h3>1 Members</h3>
                    </div>
                </div>
                <div className={"flex justify-center items-center"}>
                    <h2 className={"text-4xl font-bold italic"}>#B34Z8F</h2>
                </div>
            </header>

            <aside
                className={"col-span-2 row-span-1 bg-base-100 flex justify-end py-2 pr-8"}>
                <div className={"flex flex-row justify-end gap-4"}>
                    <Anchor title={"Call"} hideTitle={true} icon={<FaPhone/>}/>
                    <Anchor title={"Hide sidebar"} hideTitle={true} icon={<FaUsers/>}/>
                    <Anchor title={"Leave the room"} hideTitle={true} icon={<FaArrowRight/>}/>
                    <ThemeSelector />
                </div>
            </aside>

            <main className={"row-span-10 col-span-7 bg-base-200 border-t-2 border-primary flex flex-col gap-6 p-4 overflow-y-scroll"}>

                <Message own={true} />
                <Message own={false} />
                <Message own={true} />
                <Message own={false} />

            </main>

            <aside className={"row-span-11 col-span-2 bg-base-100 border-t-2 border-primary flex flex-col gap-8 p-8"}>
                <h2 className={"font-bold text-3xl"}>Room for Poggers</h2>

                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row justify-between items-center"}>
                        <h2 className={"font-bold text-2xl flex flex-row justify-center items-center text-center gap-2"}>{<FaUser/>} Members (1)</h2>
                        <Anchor icon={<FaPlus/>} title={"Invite new people"} hideTitle={true} size={"3xl"}/>
                    </div>

                    <div className={"flex flex-col gap-3"}>
                        <ListUser />
                        <ListUser />
                        <ListUser />
                        <ListUser />
                    </div>
                </div>

            </aside>

            <footer className={"row-span-1 col-span-7 bg-base-100 flex w-full p-2"}>
                <Textarea/>
            </footer>
        </main>
    );
}

export default Room;