import {account} from "@/app/utils/appwrite";

const deleteAppwriteSessions = async () => {
    try {
        await account.deleteSessions();
    } catch (e) {
        console.info("no session")
    }
}

export default deleteAppwriteSessions;