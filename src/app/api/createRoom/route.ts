import {database, databases} from "@/app/utils/appwrite-server";
import {Query} from "node-appwrite";
import {ID, Permission, Role} from "appwrite";

const apiHandler = async (token: string, name: string, avatar: File, roomName: string, roomDescription: string, roomAvatar: File) => {

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

    const generatedCode = await generateUniqueRoomCode();

    const newUser: any = await databases.createDocument(
        database,
        "users",
        generatedCode,
        {
            name: name,
            // avatar: avatar,
            token: token,
            room: {
                name: roomName,
                closed: false,
                description: roomDescription,}
        },
        [
            Permission.read(Role.any())
        ]
    );

    if(newUser && newUser.room && newUser.room.$id) return Response.json({ roomCode: generatedCode });
    return Response.json({ error: "Unknown error." }, { status: 500 })

}

export async function POST(req: Request, res: Response) {
    const { token, name, avatar, roomName, roomDescription, roomAvatar } = await req.json();

    if(!token){
        return Response.json({ error: 'Please fill in all the required fields.' }, { status: 400 })
    }

    return apiHandler(token, name, avatar, roomName, roomDescription, roomAvatar);
}
