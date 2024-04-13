import React from "react";

interface AnchorProps {
    title: string
    hideTitle?: boolean
    icon?: React.ReactNode
    className?: string
    size?: string,
}

export const Anchor = ({ title, hideTitle = false, icon, className, size = "5xl" } : AnchorProps ) => {
    return (
        <a title={title} className={`flex justify-center items-center text-center text-${size} ${className} text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer`}>
            {icon} {!hideTitle && title}
        </a>
    );
};