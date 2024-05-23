import deleteAppwriteSessions from "@/app/utils/deleteAppwriteSessions";

const removeExistingUserAccount = async () => {
    const localStorageUser = localStorage.getItem("user");
    if(localStorageUser){
        const localUser = JSON.parse(localStorageUser);
        if(localUser && !localUser?.email){
            localStorage.removeItem("user")
            console.warn("DELETING SESSIONS")
            await deleteAppwriteSessions();
            return false;
        }
        if(localUser && localUser.email){
            return "permanent";
        }
    }
    return true;
}

export default removeExistingUserAccount;