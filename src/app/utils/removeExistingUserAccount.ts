import {account} from "@/app/utils/appwrite";

const removeExistingUserAccount = async () => {
    const localStorageUser = localStorage.getItem("user");
    if(localStorageUser){
        const localUser = JSON.parse(localStorageUser);
        if(localUser && !localUser?.email){
            localStorage.removeItem("user")
            console.warn("DELETING SESSIONS")
            try {
                await account.deleteSessions();
            } catch (e) {
                console.info("NO SESSION");
            }
            return false;
        }
        if(localUser && localUser.email){
            return "permanent";
        }
    }
    return true;
}

export default removeExistingUserAccount;