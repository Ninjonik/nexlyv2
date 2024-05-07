import React, {SetStateAction, useEffect, useState} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import {LiveKitRoom, PreJoin} from "@livekit/components-react";
import '@livekit/components-styles';
import {Button} from "@/app/components/Button";
import VideoConference from "@/app/components/Room/VideoConference";
import {CiMaximize1, CiMinimize1} from "react-icons/ci";
import {FiPhoneForwarded} from "react-icons/fi";
import {ImPhoneHangUp} from "react-icons/im";

interface RoomCallProps {
    room: Room,
    inCall: boolean,
    setInCall: React.Dispatch<SetStateAction<boolean>>,
    hideCall: boolean,
    setHideCall: React.Dispatch<SetStateAction<boolean>>,
    handleOnDisconnectedFn: () => void,
}

export const RoomCall = ({ room, inCall, setInCall, hideCall, setHideCall, handleOnDisconnectedFn } : RoomCallProps) => {

    const { user } = useUserContext();
    const [token, setToken] = useState<string>("");
    const [fullscreen, setFullscreen] = useState<boolean>(false);

    useEffect(() => {
        if(!room.call || !user?.name) return;

        (async () => {
            try {
                const resp = await fetch(
                    `/api/getParticipantToken?room=${room.$id}&username=${user.name}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [room.$id, room.call, user?.name]);

    if(!user || !token || !room.call) return "";

    return (
        <section className={"bg-base-200 flex flex-col gap-6 w-full border-r-2 border-t-2 border-primary"}>

            {!hideCall ? (
                inCall ? (
                    <div className={`flex flex-col gap-[1dvw] bg-light transition-all duration-100 ${fullscreen ? 'absolute w-[100dvw] h-[100dvh] top-0 left-0 z-50' : 'relative w-full min-h-96 h-full'} resize-y overflow-auto`}>
                        <LiveKitRoom
                            video={false}
                            audio={false}
                            connect={inCall}
                            token={token}
                            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                            data-lk-theme="default"
                            className='flex flex-col h-full'
                            onDisconnected={handleOnDisconnectedFn}
                        >
                            <VideoConference handleOnDisconnectedFn={handleOnDisconnectedFn} />
                            <button
                                className='h-[2dvw] w-[2dvw] p-[1dvw] text-lightly hover:text-white transition-all flex justify-center items-center text-center rounded-xl absolute left-4 bottom-4 md:left-1 md:bottom-1'
                                onClick={() => setFullscreen(!fullscreen)}>
                                <label className="swap swap-rotate text-white hover:text-secondary ease-in transition-all text-xl">

                                    {fullscreen ? (
                                        <div><CiMinimize1 /></div>
                                    ) : (
                                        <div><CiMaximize1 /></div>
                                    )}

                                </label>
                            </button>
                        </LiveKitRoom>
                    </div>
                ) : (
                    <div className={"w-screen h-screen flex justify-center items-center absolute bg-opacity-25 backdrop-blur-sm z-50"}>
                        <div className={"flex flex-col h-full py-4 px-96 gap-4"} data-lk-theme="default">
                            <PreJoin onSubmit={() => setInCall(true)} defaults={{username: user.name}} />
                            <Button color={"secondary"} icon={<ImPhoneHangUp />} text={"Hang the call"} title={"Hides the call"}
                                    onClick={() => setHideCall(true)}/>
                        </div>
                    </div>
                )
            ) : (
                <div className={"flex flex-col px-24 py-4 justify-center items-center w-full"}>
                    <Button color={"secondary"} icon={<FiPhoneForwarded />} text={"Join the call"} title={"Joins the call"}
                            onClick={() => setHideCall(false)}/>
                </div>
            )}


        </section>
    );

};