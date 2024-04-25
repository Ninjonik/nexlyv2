import {ID, Permission, Role} from "appwrite";
import {storage} from "@/app/utils/appwrite";

export default async function uploadMultipleFiles(files: File[]) {
    const fileIds = [];
    for (let file of files) {
        const response = await storage.createFile('attachments', ID.unique(), file, [
            Permission.read(Role.any()),
        ]);
        if (response && response.$id) {
            fileIds.push(response.$id);
        } else {
            console.error("Failed to upload file: ", file.name);
        }
    }
    return fileIds;
}