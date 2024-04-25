import {storage} from "@/app/utils/appwrite";

export default function getFileDownload(bucket: string, file: string) {
    const response = storage.getFileDownload(bucket, file);
    if (response && response.href) {
        return response.href;
    } else {
        return "";
        console.error("Failed to get file download: ", file);
    }
}