interface AvatarProps {
    className?: string,
    avatar?: string
}

export const Avatar = ({ className, avatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg" } : AvatarProps) => {
    return (
        <div className={`avatar ${className}`}>
            <div className="w-16 h-16 mask mask-squircle">
                <img src={avatar}/>
            </div>
        </div>
    );
};