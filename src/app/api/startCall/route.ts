import {database, databases} from "@/app/utils/appwrite-server";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";
import User from "@/app/utils/interfaces/UserInterface";

const apiHandler = async (roomId: string, id: string) => {

    const userData = await databases.getDocument(
        database,
        "users",
        id
    ) as User

    if(!userData || !userData.room || userData.room.$id !== roomId) Response.json({ error: "Room not found / user not in the room." }, { status: 400 })

    const res = await databases.updateDocument(
        database,
        "rooms",
        roomId,
        {
            call: true,
        }
    );

    if(res) return Response.json({ status: "Successfully started a call in the room." });
    return Response.json({ error: "Unknown error." }, { status: 500 })

}

export async function PATCH(req: Request, res: Response) {
    const { jwt, roomId } = await req.json();

    if(!jwt || !roomId){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    // VERIFY JWT
    let account;
    try {
        clientJWT.setJWT(jwt.jwt);
        account = await accountJWT.get()
        if(!account || !account.$id) {
            return Response.json({ error: 'Invalid JWT' }, { status: 401 })
        }
    } catch (e) {
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }

    return apiHandler(roomId, account.$id);
}
