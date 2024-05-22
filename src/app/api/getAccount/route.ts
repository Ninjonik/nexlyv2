import {database, databases} from "@/app/utils/appwrite-server";
import {account as accountJWT, client as clientJWT} from "@/app/utils/appwrite-jwt";
import {generate} from "random-words";
import {Permission, Role} from "node-appwrite";

const apiHandler = async (id: string) => {

    try {
        const userData = await databases.getDocument(database, "users", id);

        if(userData && userData?.$id) return Response.json({ user: userData });
        return Response.json({ error: "Unknown error." }, { status: 500 })
    } catch(e: any) {
        console.error(e);
        console.info(e.message);
        return Response.json({ error: e.message }, { status: 400 })
    }

}

export async function GET(req: Request, res: Response) {
    const { jwt } = await req.json();

    if(!jwt){
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

    return apiHandler(account.$id);
}
