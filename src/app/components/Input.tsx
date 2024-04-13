interface InputProps {
    className?: string
    placeholder?: string
    label?: string
    name: string
}

export const Input = ({className = "w-full", placeholder = "", label, name} : InputProps) => {
    return (
        <div className={"flex flex-col gap-2 text-primary"}>
            {label && (
                <label className={"text-left"} htmlFor={name}>{label}</label>
            )}
            <input name={name} id={name} type="text" placeholder={placeholder} className={`input input-bordered input-primary ${className}`}/>
        </div>
    );
};