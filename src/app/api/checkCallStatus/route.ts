import { RoomServiceClient } from "livekit-server-sdk";
import {NextRequest, NextResponse} from "next/server";
import {databases} from "@/app/utils/appwrite-server";
import {database} from "@/app/utils/appwrite";

export async function GET(req: NextRequest) {
    try {

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

        if (!apiKey || !apiSecret || !wsUrl) {
            return NextResponse.json(
                { error: "Server misconfigured" },
                { status: 500 }
            );
        }

        const roomService = new RoomServiceClient(wsUrl, apiKey, apiSecret);

        const room = req.nextUrl.searchParams.get("room");

        if (!room) {
            return NextResponse.json(
                { error: 'Missing "room" query parameter' },
                { status: 400 }
            );
        }

        const participants = await roomService.listParticipants(room);

        let status = 'TRUE'

        if (participants.length === 0) {
            try {
                const res =  await databases.updateDocument(
                    database,
                    'rooms',
                    room,
                    {
                        call: false
                    }
                );
            } catch (error) {
                console.error('Error setting call to false:', error);
                const res = error;
            }
            status = 'FALSE'
        }

        return Response.json({ 'status': status })
    } catch (error) {
        console.error('Error checking room status:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
