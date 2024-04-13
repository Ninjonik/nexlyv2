"use client"

import {ReactNode} from "react";

interface ButtonProps {
    color?: "primary" | "secondary" | "accent" | "default"
    type?: 'submit' | 'reset' | 'button'
    onClick?: () => void
    title?: string
    text?: string
    icon?: ReactNode
}

export const Button = ({ color = "default", type = "button", onClick = () => {}, title = "", text = "", icon } : ButtonProps) => {
    return (
        <button
            title={ (title ? title : (text ?? " ")) } type={type}
            className={`btn btn-outline btn-${color}`}
            onClick={onClick}
        >
            {icon && icon} {text}
        </button>
    );
};