"use client"

import {ReactNode} from "react";
import {Loading} from "@/app/components/Loading";

interface ButtonProps {
    color?: "primary" | "secondary" | "accent" | "default"
    type?: 'submit' | 'reset' | 'button'
    onClick?: () => void
    title?: string
    text?: string
    icon?: ReactNode
    name?: string
    disabled?: boolean
    loading?: boolean
}

export const Button = ({ color = "default", type = "button", onClick = () => {}, title = "", text = "", icon, name = "", disabled = false, loading = false } : ButtonProps) => {
    return (
        <button
            title={ (title ? title : (text ?? " ")) } type={type}
            className={`btn btn-outline btn-${color}`}
            name={name}
            id={name}
            onClick={onClick}
            disabled={disabled}
        >
            {loading && ( <Loading /> )} {icon && icon} {text}
        </button>
    );
};