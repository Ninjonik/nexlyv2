import User from "@/app/utils/interfaces/UserInterface";
import Room from "@/app/utils/interfaces/RoomInterface";

export default interface Message {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    author: User;
    room: Room;
    message: string | null;
    attachments: string[];
    $databaseId: string;
    $collectionId: string;
}