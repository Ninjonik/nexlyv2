interface AvatarProps {
    className?: string,
    avatar?: string
}

export const Avatar = ({ className, avatar = "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" } : AvatarProps) => {
    return (
        <div className={`avatar ${className}`}>
            <div className="w-16 h-16 mask mask-squircle">
                <img src={avatar}/>
            </div>
        </div>
    );
};