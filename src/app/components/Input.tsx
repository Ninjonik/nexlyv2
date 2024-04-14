import React, {useCallback} from "react";

interface InputProps {
    className?: string
    placeholder?: string
    label?: string
    name: string
    required?: boolean
    form?: any,
    setForm?: React.Dispatch<React.SetStateAction<any>>
}

export const Input = ({className = "w-full", placeholder = "", label, name, required = false, form = "", setForm = () => {}} : InputProps) => {
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value
        setForm((prevForm: any) => ({
            ...prevForm,
            [name]: value
        }));
    }, [setForm, name]);

    return (
        <div className={"flex flex-col gap-2 text-primary"}>
            {label && (
                <label className={"text-left"} htmlFor={name}>{label}</label>
            )}
            <input name={name} id={name} required={required} type="text" placeholder={placeholder} value={form} onChange={handleInputChange} className={`input input-bordered input-primary ${className}`}/>
        </div>
    );
};