import {database, databases} from "@/app/utils/appwrite-server";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";
import {ID, Permission, Role} from "node-appwrite";
import Room from "@/app/utils/interfaces/RoomInterface";

const apiHandler = async ( message: string, attachments: [], roomId: string, userId: string ) => {

    try {
        const roomData: Room = await databases.getDocument(
            database,
            "rooms",
            roomId
        );

        if(!roomData) throw "No data!";

        let permissions: string[] = [];
        let userInRoom = false;
        roomData.users.map((user) => {
            permissions.push(Permission.read(Role.user(user.$id)));
            if(user.$id === userId) userInRoom = true;
        })

        if(!userInRoom) throw "User not in the room!";

        const result = await databases.createDocument(
            database,
            "messages",
            ID.unique(),
            {
                room: roomId,
                author: userId,
                message: message
            },
            permissions
        );
        return Response.json({ data: result })
    } catch (error) {
        console.error('Error creating a message:', error);
        return Response.json({ error: "There has been an error while processing your request" }, { status: 500 })
    }

}

export async function POST(req: Request, res: Response) {
    const { jwt, message, attachments, roomId } = await req.json();

    if(!jwt || !message || !roomId){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    // VERIFY JWT
    clientJWT.setJWT(jwt.jwt);
    const account = await accountJWT.get()
    if(!account || !account.$id) {
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }

    return await apiHandler(message, attachments, roomId, account.$id);
}
