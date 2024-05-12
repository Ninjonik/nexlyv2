import React, {useCallback} from "react";

interface InputProps {
    className?: string
    placeholder?: string
    label?: string
    name: string
    required?: boolean
    form?: any,
    color?: "primary" | "secondary",
    setForm?: React.Dispatch<React.SetStateAction<any>>
    type?: "email" | "text" | "number" | "password"
}

export const Input = ({className = "w-full", placeholder = "", label, name, required = false, form = "", setForm = () => {}, color = "primary", type = "text"} : InputProps) => {
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value
        setForm((prevForm: any) => ({
            ...prevForm,
            [name]: value
        }));
    }, [setForm, name]);

    const classes = ["input-primary", "input-secondary"]

    return (
        <div className={`flex flex-col gap-2 text-${color}`}>
            {label && (
                <label className={"text-left"} htmlFor={name}>{label}</label>
            )}
            <input name={name} id={name} required={required} type={type} placeholder={placeholder} value={form} onChange={handleInputChange} className={`input input-bordered input-${color} ${className}`}/>
        </div>
    );
};