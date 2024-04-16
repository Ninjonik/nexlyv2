import {database, databases} from "@/app/utils/appwrite-server";
import {Query} from "node-appwrite";

const apiHandler = async (roomCode: string) => {
    const roomData = await databases.getDocument(
        database,
        "rooms",
        roomCode
    )

    if (roomData && roomData?.$id) {
        return Response.json({ success: "Success" }, { status: 200 })
    } else {
        return Response.json({ error: 'Room with this invite code was not found.' }, { status: 404 })
    }

}

export async function POST(req: Request, res: Response) {
    const { roomCode } = await req.json();

    if(!roomCode){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    return apiHandler(roomCode);
}
