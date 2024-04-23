"use client"

import React from "react";

interface AnchorProps {
    title: string;
    hideTitle?: boolean;
    icon?: React.ReactNode;
    className?: string;
    size?: string;
    action?: () => void;
}

export const Anchor = ({ title, hideTitle = false, icon, className, size = "5xl", action }: AnchorProps) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (action) {
            event.preventDefault(); // Prevent the default link behavior if action is provided
            action();
        }
    };

    return (
        <a
            title={title}
            className={`flex justify-center items-center text-center text-${size} ${className} text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer`}
            onClick={handleClick}
        >
            {icon} {!hideTitle && title}
        </a>
    );
};
