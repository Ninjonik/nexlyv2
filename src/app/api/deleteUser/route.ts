import {database, databases} from "@/app/utils/appwrite-server";
import {Query} from "node-appwrite";

const apiHandler = async (token: string) => {

    const query = await databases.listDocuments(
        database,
        "users",
        [
            Query.equal("token", token),
        ]
    )

    if (query && query.documents && query.documents[0]) {
        const userData = query.documents[0]

        await databases.deleteDocument(
            database,
            "users",
            userData.$id
        )

        return Response.json({ success: "Success" }, { status: 200 })
    } else {
        return Response.json({ error: "User with this token was not found." }, { status: 404 })
    }

}

export async function POST(req: Request, res: Response) {
    const { token } = await req.json();

    if(!token){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    return apiHandler(token);
}
