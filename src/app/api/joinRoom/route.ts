import {database, databases} from "@/app/utils/appwrite-server";
import {Query, Permission, Role} from "node-appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";
import User from "@/app/utils/interfaces/UserInterface";

const apiHandler = async (roomCode: string, name: string, avatar: string, id: string, permanentAccount: boolean) => {
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
        let newUser: User;
        if(permanentAccount) {
            newUser = await databases.updateDocument(
                database,
                "users",
                id,
                {
                    room: roomData.$id
                },
                [
                    Permission.read(Role.any())
                ]
            )
        } else {
            newUser = await databases.createDocument(
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
        }


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
    let permanentAccount = false;
    try {
        clientJWT.setJWT(jwt);
        account = await accountJWT.get();
        if(!account || !account.$id) {
            return Response.json({ error: 'Invalid JWT' }, { status: 401 })
        }
        if(account?.email){
            permanentAccount = true;
        }
    } catch (e) {
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }


    return apiHandler(roomCode, name, avatar, account.$id, permanentAccount);
}
