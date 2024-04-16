import {JoinRoomForm} from "@/app/components/JoinRoom/JoinRoomForm";

export default function JoinRoom({ params } : { params: {roomCode: string} }) {
    return (
        <main className={"w-full h-full flex flex-col justify-center items-center"}>
            <div className={"h-2/3 w-1/3 bg-base-100 rounded-xl flex flex-col items-center text-center p-8 gap-8"}>
                <div className={"flex flex-col gap-4 text-center"}>
                    <h1 className={"text-5xl font-bold"}>Nexly</h1>
                    <h2 className={"text-2xl"}>Welcome to <b>Nexly</b>!</h2>
                    <h3 className={"text-sm"}>Nexly is the ultimate combination of safe, private and easy-to-use one-time
                        realtime chat-messaging and video-calling application.</h3>
                </div>
                <div className={"flex flex-col gap-4 justify-evenly w-full h-full"}>
                    <JoinRoomForm roomCode={params.roomCode} />
                </div>
            </div>
        </main>
    );
}
