import {account} from "@/app/utils/appwrite";

const isPermanentAccount = async () => {
    const localStorageUser = localStorage.getItem("user");
    if(localStorageUser){
        const localUser = JSON.parse(localStorageUser);
        if(localUser && localUser?.email){
            try {
                await account.get();
            } catch (e) {
                return false;
            }
            return true;
        }
    }
    return false;
}

export default isPermanentAccount;