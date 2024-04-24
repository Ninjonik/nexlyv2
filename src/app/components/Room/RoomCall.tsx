import React, {useEffect, useState} from "react";
import Room from "@/app/utils/interfaces/RoomInterface";
import {useUserContext} from "@/app/utils/UserContext";
import {LiveKitRoom, PreJoin} from "@livekit/components-react";
import '@livekit/components-styles';
import {Button} from "@/app/components/Button";
import VideoConference from "@/app/components/Room/VideoConference";

interface RoomCallProps {
    room: Room,
}

export const RoomCall = ({ room } : RoomCallProps) => {

    const { user } = useUserContext();
    const [token, setToken] = useState<string>("");
    const [inCall, setInCall] = useState<boolean>(false);
    const [hideCall, setHideCall] = useState<boolean>(false);
    const [fullscreen, setFullscreen] = useState<boolean>(false);

    const onDisconnectedFn = async () => {

        try {
            setHideCall(true);
            setInCall(false);

            const response = await fetch(`/api/checkCallStatus?room=${room.$id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to call');
            }

        } catch (err: any) {
            console.error(err);
        }
    }

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
        <section className={"bg-base-200 flex flex-col gap-6 h-full w-full border-r-2 border-t-2 border-primary"} id="scrollableDiv">

            {!hideCall ? (
                inCall ? (
                    <div className={`flex flex-col gap-[1dvw] bg-light transition-all duration-100 ${fullscreen ? 'absolute w-[100dvw] h-[100dvh] top-0 left-0 z-50' : 'relative w-full h-full'}`}>
                        <LiveKitRoom
                            video={false}
                            audio={false}
                            connect={inCall}
                            token={token}
                            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                            data-lk-theme="default"
                            className='flex flex-col h-full'
                            onDisconnected={onDisconnectedFn}
                        >
                            <VideoConference onDisconnectedFn={onDisconnectedFn} />
                            <button
                                className='h-[2dvw] w-[2dvw] p-[1dvw] text-lightly hover:text-white transition-all flex justify-center items-center text-center rounded-xl absolute right-[0.5dvw] bottom-[0.5dvw]'
                                onClick={() => setFullscreen(!fullscreen)}>
                                <label className="btn btn-circle swap swap-rotate">

                                    {fullscreen ? (
                                        <div>MIN</div>
                                    ) : (
                                        <div>MAX</div>
                                    )}

                                </label>
                            </button>
                        </LiveKitRoom>
                    </div>
                ) : (
                    <div className={"flex flex-col h-full py-4 px-96 gap-4"} data-lk-theme="default">
                        <PreJoin onSubmit={() => setInCall(true)} userLabel={user.name}/>
                        <Button color={"secondary"} text={"Hide call"} title={"Hides the call"}
                                onClick={() => setHideCall(true)}/>
                    </div>
                )
            ) : (
                <div className={"flex flex-col px-24 py-4 justify-center items-center w-full"}>
                    <Button color={"secondary"} text={"Show the call"} title={"Shows the call"} onClick={() => setHideCall(false)} />
                </div>
            )}


        </section>
    );

};