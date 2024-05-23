import {database, databases} from "@/app/utils/appwrite-server";
import {Permission, Role} from "node-appwrite";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";

const apiHandler = async (name: string, avatar: string = "defaultAvatar", id: string) => {

    try {
        const newUser: any = await databases.createDocument(
            database,
            "users",
            id,
            {
                name: name,
                avatar: avatar,
            },
            [
                Permission.read(Role.any())
            ]
        );

        if(newUser) return Response.json({ newUser: newUser });
        return Response.json({ error: "Unknown error." }, { status: 400 })
    } catch(e: any) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 400 })
    }

}

export async function POST(req: Request, res: Response) {
    const { name, avatar, jwt } = await req.json();

    if(!jwt || !name){
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
        return Response.json({ error: 'Invalid JWT' }, { status: 401 })
    }

    return apiHandler(name, avatar, account.$id);
}
