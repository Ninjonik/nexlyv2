import {database, databases} from "@/app/utils/appwrite-server";
import {Query} from "node-appwrite";
import {ID, Permission, Role} from "appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";

const apiHandler = async (roomCode: string, name: string, avatar: string, id: string) => {
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
            id,
            {
                name: name,
                avatar: avatar,
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
    const { roomCode, name, avatar, jwt } = await req.json();

    if(!roomCode || !jwt){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    // VERIFY JWT
    let account;
    try {
        clientJWT.setJWT(jwt);
        account = await accountJWT.get()
        if(!account || !account.$id) {
            return Response.json({ error: 'Invalid JWT' }, { status: 401 })
        }
    } catch (e) {
        console.log(e);
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }


    return apiHandler(roomCode, name, avatar, account.$id);
}
