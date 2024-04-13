import {Client, Account, Databases, Functions} from "node-appwrite";
import { cookies } from "next/headers";
import {Avatars, Storage} from "appwrite";

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProject = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

export const client = new Client();

if (appwriteEndpoint && appwriteProject) {
    client
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProject);
} else {
    console.error("Please make sure APPWRITE_ENDPOINT APPWRITE_PROJECT APPWRITE_KEY are defined in your environment variables.");
}

const session = cookies().get("login-session");
if (!session || !session.value) {
    throw new Error("No session");
}

client.setSession(session.value);
export const account = new Account(client);
export const database = process.env.NEXT_PUBLIC_APPWRITE_DB_NAME ?? 'appwrite'
export const databases = new Databases(client);
export const functions = new Functions(client)