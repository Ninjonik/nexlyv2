"use client"

import {ReactNode} from "react";

interface ButtonProps {
    color?: "primary" | "secondary" | "accent" | "default"
    type?: 'submit' | 'reset' | 'button'
    onClick?: () => void
    title?: string
    text?: string
    icon?: ReactNode
    name?: string
}

export const Button = ({ color = "default", type = "button", onClick = () => {}, title = "", text = "", icon, name = "" } : ButtonProps) => {
    return (
        <button
            title={ (title ? title : (text ?? " ")) } type={type}
            className={`btn btn-outline btn-${color}`}
            name={name}
            id={name}
            onClick={onClick}
        >
            {icon && icon} {text}
        </button>
    );
};