import {account} from "@/app/utils/appwrite";
import UserLocalStorageInterface from "@/app/utils/interfaces/UserLocalStorageInterface";

const isPermanentAccount = async (): Promise<false | UserLocalStorageInterface> => {
    const localStorageUser = localStorage.getItem("user");
    if(localStorageUser){
        const localUser = JSON.parse(localStorageUser);
        if(localUser && localUser?.email){
            let permanentAccount;
            try {
                permanentAccount = await account.get();
                permanentAccount = {...permanentAccount, avatar: localUser.avatar}
            } catch (e) {
                return false;
            }
            return permanentAccount;
        }
    }
    return false;
}

export default isPermanentAccount;