import {Avatar} from "@/app/components/Avatar";

interface MessageProps {
    own?: boolean,
}

export const Message = ({ own } : MessageProps) => {
    return (
        <div className={`flex flex-row max-w-[50%] gap-4 ${own ? "place-self-start" : "place-self-end"}`}>
            <Avatar className={own ? "" : "order-2"} />
            <div className={`flex flex-col w-full gap-1`}>
                <div className={"flex flex-row items-baseline text-center gap-2"}>
                    <span className={`text-2xl font-bold ${!own && "order-2"}`}>Ťikťok</span>
                    <span>yesterday 12:01 PM</span>
                </div>
                <div className={`${own ? "rounded-r-lg" : "rounded-l-lg"} rounded-b-lg bg-base-300 w-full p-1`}>
                    a
                </div>
            </div>
        </div>
    );
};