import {database, databases} from "@/app/utils/appwrite-server";
import {Query} from "node-appwrite";
import {ID, Permission, Role} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";

const apiHandler = async (roomCode: string, token: string, name: string, avatar: File) => {
    const roomQuery = await databases.listDocuments(
        database,
        "rooms",
        [
            Query.equal("$id", roomCode.toUpperCase()),
            Query.equal("closed", false)
        ]
    ) as { documents: Room[] }

    if (roomQuery && roomQuery.documents && roomQuery.documents[0]) {
        const roomData = roomQuery.documents[0]
        const newUser = await databases.createDocument(
            database,
            "users",
            ID.unique(),
            {
                name: name,
                avatar: avatar,
                token: token,
                room: roomData.$id
            },
            [
                Permission.read(Role.any())
            ]
        )

        return Response.json({ success: 'Room successfully joined..', newUser: newUser }, { status: 200 })
    } else {
        return Response.json({ error: 'Room with this invite code was not found.' }, { status: 404 })
    }

}

export async function PATCH(req: Request, res: Response) {
    const { roomCode, token, name, avatar } = await req.json();

    if(!roomCode || !token){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    return apiHandler(roomCode, token, name, avatar);
}
