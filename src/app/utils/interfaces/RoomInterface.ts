import User from "@/app/utils/interfaces/UserInterface";
import Message from "@/app/utils/interfaces/MessageInterface";

export default interface Room {
    name: string;
    closed: boolean;
    description: string;
    call: boolean;
    avatar: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    users: User[];
    messages: Message[];
    $databaseId: string;
    $collectionId: string;
}
