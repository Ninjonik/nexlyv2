import {account} from "@/app/utils/appwrite";

const removeExistingUserAccount = async () => {
    const localStorageUser = localStorage.getItem("user");
    if(localStorageUser){
        const localUser = JSON.parse(localStorageUser);
        if(localUser && !localUser?.email){
            localStorage.removeItem("user")
            console.warn("DELETING SESSIONS")
            await account.deleteSessions()
            return false;
        }
        if(localUser && localUser.email){
            return "permanent";
        }
    }
    return true;
}

export default removeExistingUserAccount;