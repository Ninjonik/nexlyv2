import React, {ReactNode} from "react";

interface ModalProps {
    title?: string,
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    children?: ReactNode
}

export const Modal = ({title = "", children, state, setState}: ModalProps) => {
    return (
        <div className={`absolute right-0 top-0 w-[100dvw] h-[100dvh] flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm z-50 ${state ? "opacity-100" : "opacity-0 w-0 h-0"}`} onClick={() => setState(false)}>
            <div className={"bg-base-100 flex flex-col p-4 rounded-lg border-2 border-primary gap-2"} onClick={e => e.stopPropagation()}>
                <h2 className={"text-primary font-bold text-center capitalize text-xl"}>{title}</h2>
                {children}
            </div>
        </div>

    );
};