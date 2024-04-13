interface AvatarProps {
    className?: string
}

export const Avatar = ({ className } : AvatarProps) => {
    return (
        <div className={`avatar ${className}`}>
            <div className="w-16 mask mask-squircle">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
            </div>
        </div>
    );
};