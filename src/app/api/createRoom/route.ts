import {database, databases} from "@/app/utils/appwrite-server";
import {ID, Permission, Role} from "appwrite";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";

const apiHandler = async (name: string, avatar: string = "defaultAvatar", roomName: string, roomDescription: string, roomAvatar: string = "defaultAvatar", id: string) => {

    const generateUniqueRoomCode = async () => {
        let generatedCode = "";
        let codeExists = true;

        while (codeExists) {
            // Generate a new 7-character code (numbers/alphabet/uppercase)
            generatedCode = Math.random().toString(36).substring(2, 9).toUpperCase();

            // Check if the code already exists in the database
            const res = await fetch(
                process.env.NEXT_PUBLIC_HOSTNAME + `/api/checkRoom`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "roomCode": generatedCode,
                    }),
                }
            )
            const resJson = await res.json();
            if(resJson?.error){
                /* Code does not exist, so end the loop */
                codeExists = false
                continue
            }
            codeExists = true
        }

        return generatedCode;
    };

    try {
        const generatedCode = await generateUniqueRoomCode();

        const newUser: any = await databases.createDocument(
            database,
            "users",
            id,
            {
                name: name,
                avatar: avatar,
                room: {
                    "$id": generatedCode,
                    name: roomName,
                    closed: false,
                    avatar: roomAvatar,
                    description: roomDescription,
                    "$permissions": [
                        Permission.read(Role.user(id)),
                        Permission.create(Role.user(id)),
                        Permission.update(Role.user(id)),
                        Permission.delete(Role.user(id)),
                        Permission.read(Role.any()),
                    ]
                }
            },
            [
                Permission.read(Role.any())
            ]
        );

        if(newUser && newUser.room && newUser.room.$id) return Response.json({ roomCode: generatedCode, newUser: newUser });
        return Response.json({ error: "Unknown error." }, { status: 500 })
    } catch(e: any) {
        console.error(e);
        console.info(e.message);
        return Response.json({ error: e.message }, { status: 400 })
    }



}

export async function POST(req: Request, res: Response) {
    const { name, avatar, roomName, roomDescription, roomAvatar, jwt } = await req.json();

    if(!jwt){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    // VERIFY JWT
    clientJWT.setJWT(jwt.jwt);
    const account = await accountJWT.get()
    if(!account || !account.$id) {
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }

    return apiHandler(name, avatar, roomName, roomDescription, roomAvatar, account.$id);
}
